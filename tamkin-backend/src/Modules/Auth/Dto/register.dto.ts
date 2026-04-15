import { IsNotEmpty, IsString, Length } from "class-validator";
import { PickType } from '@nestjs/mapped-types';
import { UserValidators } from "src/Common/Validators/user.validate";

export class GoogleLoginDto {
    @IsString()
    @IsNotEmpty()
    id_token: string;
}

export class LoginDto extends PickType(UserValidators, ["email", "password"]) {}

export class RegisterDto extends PickType(UserValidators, ["fullName", "password", "confirmPassword", "email", "nationality"]) {}

export class ConfirmEmailDto {
    @Length(6, 6)
    @IsString()
    @IsNotEmpty()
    code: string;
}