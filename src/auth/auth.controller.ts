import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  // @Post('test')
  // @UseGuards(AuthGuard())
  // async test(@GetAuthUser() user) {
  //   console.log(user);
  // }
}
