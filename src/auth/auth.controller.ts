import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { Public } from 'src/core/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignUpDto) {
    // return { ...body, statusDescription: 'noToast' };
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }
}
