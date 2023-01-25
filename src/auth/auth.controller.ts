import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetAuthUser } from './decorators/get-auth-user.decorator';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() credentialsDto: LoginCredentialsDto) {
    return this.authService.login(credentialsDto);
  }

  @UseGuards(AuthGuard())
  @Get('/me')
  async me(@GetAuthUser() user: User) {
    return this.authService.me(user.id);
  }
}
