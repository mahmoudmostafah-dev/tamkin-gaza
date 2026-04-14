import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/DataBase/Models/user.model';
import { JwtModel } from 'src/DataBase/Models/jwt.model';
import { ClientInfoService } from './Services/Security/client-info.service';
import { ResponseService } from './Services/Response/response.service';
import { TokenService } from './Services/Security/token.service';
import { HashingService } from './Services/Security/Hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, JwtModel])],
  providers: [ResponseService, ClientInfoService, TokenService, HashingService],
  exports: [
    TypeOrmModule.forFeature([UserModel, JwtModel]),
    ResponseService,
    ClientInfoService,
    TokenService,
    HashingService,
  ],
})
export class CommonModule {}
