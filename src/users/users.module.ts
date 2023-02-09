import { Module } from '@nestjs/common';
// import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from 'src/auth/auth.module';
// import { CryptoService } from 'src/auth/crypto.service';
import { Ward } from 'src/wards/entities/ward.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ward]),
    // forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // providers: [UsersService, CryptoService],
  exports: [UsersService],
})
export class UsersModule {}
