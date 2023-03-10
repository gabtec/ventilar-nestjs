import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { CryptoService } from './crypto.service';
import { AccessTokenStrategy } from './jwt/accessToken-jwt.strategy';
import { RefreshTokenStrategy } from './jwt/refreshToken-jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.register({}),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       secret: configService.get('tokens.accessToken.secret'),
    //       signOptions: {
    //         expiresIn: configService.get('tokens.accessToken.duration'),
    //       },
    //       // secret: configService.get('ACCESS_TOKEN_SECRET'),
    //       // signOptions: { expiresIn: configService.get('ACCESS_TOKEN_DURATION') },
    //     };
    //   },
    // }),
    // forwardRef(() => UsersModule), // this avoids circular dependencie problem
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  // providers: [AuthService, CryptoService, JwtStrategy],
  exports: [AccessTokenStrategy, RefreshTokenStrategy],
  // exports: [CryptoService, JwtStrategy, PassportModule],
})
export class AuthModule {}
