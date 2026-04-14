import { Module } from "@nestjs/common";
import { ErrorResponse } from "../Utils/Response/error.response";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "src/DataBase/Models/user.model";
import { JwtModel } from "src/DataBase/Models/jwt.model";
import { ClientInfoService } from "../Utils/Security/client-info.service";
import { TokenService } from "../Utils/Security/token.service";
import { OTPService } from "../Utils/Otp/otp.service";
import { OtpModel } from "src/DataBase/Models/otp.model";
import { EmailService } from "../Utils/Email/email.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserModel, JwtModel, OtpModel])
    ],
    providers: [
        ErrorResponse,
        ClientInfoService,
        TokenService,
        EmailService,
        OTPService
    ],
    exports: [
        TypeOrmModule.forFeature([UserModel, JwtModel, OtpModel]),
        ErrorResponse,
        ClientInfoService,
        TokenService,
        EmailService,
        OTPService
    ],
})
export class CommonModule { }
