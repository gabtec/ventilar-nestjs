import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetAuthUser } from './decorators/get-auth-user.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Login success.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() credentialsDto: LoginCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.login(credentialsDto);

    response.cookie('refreshCookie', data.refreshToken, {
      httpOnly: true,
    });

    return {
      user: data.user,
      accessToken: data.accessToken,
      // refreshToken: data.refreshToken,
    };
  }

  // @UseGuards(AuthGuard())
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async me(@GetAuthUser() user: User) {
    // return this.authService.me(user.id);
    return user;
  }

  // @UseGuards(AuthGuard())
  @UseGuards(AccessTokenGuard)
  @Patch('/me/password')
  async changeMyPassword(
    @GetAuthUser() user: User,
    @Body() changePasswDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // clear cookie
    response.clearCookie('accessToken');

    // clear database token
    return await this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request) {
    console.log('on refresh');
    // console.log(req.headers);
    // const userId = req.user['sub'];
    const userMec = req.user['mec'];
    const refreshToken = req.user['refreshToken'];

    // console.log(req.user);

    return this.authService.refreshTokens(userMec, refreshToken);
  }
}
