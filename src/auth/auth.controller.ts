import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetAuthUser } from './decorators/get-auth-user.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
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

  @UseGuards(AuthGuard())
  @Patch('/me/password')
  async changeMyPassword(
    @GetAuthUser() user: User,
    @Body() changePasswDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswDto);
  }
}
