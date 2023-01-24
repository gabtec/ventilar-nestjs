import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, CryptoService],
  exports: [CryptoService],
})
export class AuthModule {}
