import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
    PassportModule.register({}),
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
    //       // secret: configService.get('JWT_SECRET'),
    //       // signOptions: { expiresIn: configService.get('JWT_DURATION') },
    //     };
    //   },
    // }),
    // forwardRef(() => UsersModule), // this avoids circular dependencie problem
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  // providers: [AuthService, CryptoService, JwtStrategy],
  exports: [AccessTokenStrategy, PassportModule],
  // exports: [CryptoService, JwtStrategy, PassportModule],
})
export class AuthModule {}
