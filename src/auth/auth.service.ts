import { HttpException, Inject, Injectable } from '@nestjs/common';
import PG_CONNECTION from 'utils/urls';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'schema/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SignInDto, SignUpDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PG_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {}

  async signup({ user, konter }: SignUpDto) {
    const userExists = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, user.email));

    if (userExists.length > 0) {
      return 'user exists';
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const userCreated = await this.db.transaction(async (tx) => {
        const userCreated = await tx
          .insert(schema.users)
          .values({
            email: user.email,
            name: user.name,
            username: user.username,
            whatsapp: user.whatsapp,
            password: hashedPassword,
          })
          .returning();

        await tx.insert(schema.konter).values({
          name: konter.name,
          province: konter.province,
          userId: userCreated[0].id,
        });

        return userCreated[0];
      });
      return {
        statusDescription: `Data ${userCreated.name} Berhasil dibuat`,
      };
    }
  }

  async signin({ username, password }: SignInDto) {
    const userExists = await this.db
      .select()
      .from(schema.users)
      .leftJoin(schema.konter, eq(schema.konter.userId, schema.users.id))
      .where(eq(schema.users.username, username));

    if (userExists.length > 0) {
      const isValidPassword = await bcrypt.compare(
        password,
        userExists[0].users.password,
      );

      if (!isValidPassword)
        throw new HttpException('Invalid username or password', 400);
      else {
        const user = { ...userExists[0] };

        return {
          user: {
            id: user.users.id,
            username: user.users.username,
            name: user.users.name,
            email: user.users.email,
            konter: user.konters,
          },
          token: this.generateToken({
            username,
            id: user.users.id,
            konter_id: user.konters?.id || 0,
          }),
        };
      }
    } else {
      return 'user does not exist';
    }
  }

  private generateToken(payload: AUTH_PAYLOAD) {
    const token = jwt.sign(payload, process.env.SECRET!, {
      expiresIn: 10000000,
    });
    return token;
  }
}

export type AUTH_PAYLOAD = {
  username: string;
  id: number;
  konter_id: number;
};
