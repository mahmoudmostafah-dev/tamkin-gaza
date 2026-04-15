import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/DataBase/Models/user.model';
import { JwtModel } from 'src/DataBase/Models/jwt.model';
import { OtpModel } from 'src/DataBase/Models/otp.model';
import { ClientInfoService } from './Services/Security/client-info.service';
import { ResponseService } from './Services/Response/response.service';
import { TokenService } from './Services/Security/token.service';
import { HashingService } from './Services/Security/Hash/hash.service';
import { CookiesService } from './Services/Cookies/cookies.service';
import { EmailService } from './Utils/Email/email.service';
import { OTPService } from './Utils/Otp/otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, JwtModel, OtpModel])],
  providers: [ResponseService, ClientInfoService, TokenService, HashingService, CookiesService, EmailService, OTPService],
  exports: [
    TypeOrmModule.forFeature([UserModel, JwtModel, OtpModel]),
    ResponseService,
    ClientInfoService,
    TokenService,
    HashingService,
    CookiesService,
    EmailService,
    OTPService,
  ],
})
export class CommonModule {}
