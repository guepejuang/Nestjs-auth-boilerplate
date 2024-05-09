import { createZodDto } from 'nestjs-zod';
import { insertKonterSchema, insertUserSchema } from 'schema/schema';
import { z } from 'zod';

export const SignUpSchema = z.object({
  user: insertUserSchema,
  konter: insertKonterSchema,
});
export class SignUpDto extends createZodDto(SignUpSchema) {}

export class SignInDto extends createZodDto(
  insertUserSchema.pick({ username: true, password: true }),
) {}
