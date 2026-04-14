import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, Validate } from "class-validator";
import { IsCountryCode } from "./country.validate";
import { USER_REGEX } from "../Regex/User/user.regex";

export class UserValidators {
    @Matches(USER_REGEX.fullName)
    @IsString()
    @IsNotEmpty()
    fullName:string;

    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    password:string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    confirmPassword:string;

    @Validate(IsCountryCode)
    @IsString()
    @IsNotEmpty()
    nationality:string;
}