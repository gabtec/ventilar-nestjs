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
  UnauthorizedException,
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
import { CONVERTIONS } from 'src/config/constants';

const cookiesDef = {
  name: 'refreshCookie',
  options: {
    httpOnly: true,
    maxAge:
      parseInt(process.env.REFRESH_TOKEN_DURATION, 10) ||
      CONVERTIONS.ONE_DAY_MS,
  },
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    try {
      const data = await this.authService.login(credentialsDto);

      response.cookie(cookiesDef.name, data.refreshToken, cookiesDef.options);
      return {
        user: data.user,
        accessToken: data.accessToken,
        // refreshToken: data.refreshToken,
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('LOG [on AuthController]:', error.message);
        // real error are omitted from frontend, for security reasons
        console.log('LOG [on AuthController]: Will throw generic 401');
      }
      return new UnauthorizedException('Credênciais Inválidas');
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async getRefreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // console.log('on refresh');
    // console.log(req.user);
    // const userId = req.user['sub'];
    const userMec = req.user['mec'];
    const refreshToken = req.user['refreshToken'];

    // console.log(req.user);
    try {
      const tokens = await this.authService.refreshTokens(
        userMec,
        refreshToken,
      );

      response.clearCookie('refreshCookie');
      response.cookie(cookiesDef.name, tokens.refreshToken, cookiesDef.options);

      // console.log('/refresh ====> AT');
      // console.log(tokens.accessToken);
      // console.log('/refresh ====> RT cookie 2');
      // console.log(tokens.refreshToken);

      return { accessToken: tokens.accessToken };
    } catch (error) {
      // console.log('erro 3000000');
      console.log(error);
    }
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // console.log('on refresh');
    // console.log(req.user);
    // const userId = req.user['sub'];
    const userMec = req.user['mec'];
    const refreshToken = req.user['refreshToken'];

    // console.log(req.user);
    try {
      const tokens = await this.authService.refreshTokens(
        userMec,
        refreshToken,
      );

      response.clearCookie('refreshCookie');
      response.cookie(cookiesDef.name, tokens.refreshToken, cookiesDef.options);

      // console.log('/refresh ====> AT');
      // console.log(tokens.accessToken);
      // console.log('/refresh ====> RT cookie 2');
      // console.log(tokens.refreshToken);

      return { accessToken: tokens.accessToken };
    } catch (error) {
      // console.log('erro 3000000');
      console.log(error);
    }
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
    response.clearCookie('refreshCookie');

    // clear database token
    return await this.authService.logout(req.user['sub']);
  }
}
