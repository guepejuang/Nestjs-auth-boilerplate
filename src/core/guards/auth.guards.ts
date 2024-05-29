import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as jwt from 'jsonwebtoken';
import PG_CONNECTION, { secret } from 'utils/urls';
import * as schema from 'schema/schema';
import { eq } from 'drizzle-orm';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

interface jwtPayload {
  username: string;
  id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(PG_CONNECTION) private dbDrizzle: NodePgDatabase<typeof schema>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // console.log('roles', roles);
    // if (roles) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization;

    //verify token
    try {
      let jwtToken = '';
      if (token) {
        jwtToken = token.split(' ')[1];
      }
      const verified = jwt.verify(jwtToken, secret) as jwtPayload;
      const userExists = await this.dbDrizzle
        .select()
        .from(schema.users)
        .where(eq(schema.users.username, verified.username));

      if (userExists.length) {
        return true;
      }
      return false;
      //find user from db, if not exists return false. confirm role
    } catch (error) {
      console.log('erro=>', error);
      return false;
    }
    // }

    // return true;
  }
}
