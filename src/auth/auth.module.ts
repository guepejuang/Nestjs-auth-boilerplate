import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DrizzleModule } from 'src/core/drizzle/drizzle.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [DrizzleModule],
})
export class AuthModule {}
