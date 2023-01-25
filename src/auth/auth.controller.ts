import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() credentialsDto: LoginCredentialsDto) {
    return this.authService.login(credentialsDto);
  }
}
