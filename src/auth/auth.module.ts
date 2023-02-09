import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { CryptoService } from './crypto.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_TIME') },
        };
      },
    }),
    // forwardRef(() => UsersModule), // this avoids circular dependencie problem
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // providers: [AuthService, CryptoService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
  // exports: [CryptoService, JwtStrategy, PassportModule],
})
export class AuthModule {}
