import { Body, Controller, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmEmailDto, GoogleLoginDto, LoginDto, RegisterDto } from './Dto/register.dto';
import { ValidationPipe } from '@nestjs/common';
import { SuccessResponse } from 'src/Common/Utils/Response/success.response';
import type { Request, Response } from 'express';
import type { I_Request } from 'src/Common/Types/request.types';
import { AuthenticationGuard } from 'src/Common/Guards/Authentication/authentication.guard';

@UsePipes(new ValidationPipe({
  forbidNonWhitelisted: true,
  whitelist: true,
  transform: true,
}))

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('google')
  async loginWithGoogle(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: GoogleLoginDto) {
    const { user, status } = await this.authService.loginWithGoogle(req, res, body);
    return SuccessResponse({
      message: status === "register" ? req.t('auth:success.registeredSuccessfully') : req.t('auth:success.loggedSuccessfully'),
      info: req.t('auth:success.credentialsSavedInCookiesSuccessfully'),
      data: {
        user,
        status
      }
    });
  }

  @Post('register')
  async register(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RegisterDto) {
    const { user } = await this.authService.register(req, res, body);

    return SuccessResponse({
      message: req.t('auth:success.registeredSuccessfully'),
      info: req.t('auth:success.credentialsSavedInCookiesSuccessfully'),
      data: {
        user,
      }
    });
  }

  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginDto) {
    const { user } = await this.authService.login(req, res, body);

    return SuccessResponse({
      message: req.t('auth:success.loggedSuccessfully'),
      info: req.t('auth:success.credentialsSavedInCookiesSuccessfully'),
      data: {
        user,
      }
    });
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req, res);

    return SuccessResponse({
      message: req.t('auth:success.loggedOutSuccessfully'),
      info: req.t('auth:success.credentialsDeletedFromCookiesSuccessfully'),
    });
  }

  @UseGuards(AuthenticationGuard)
  @Post('request-confirm-email')
  async requestConfirmEmail(
    @Req() req: I_Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.requestConfirmEmail(req, res);

    return SuccessResponse({
      message: req.t('auth:success.requestConfirmEmail'),
      info: req.t('auth:success.otpSentToYourEmailPleaseCheckYourEmailAndConfirmYourEmail')
    });
  }

  @UseGuards(AuthenticationGuard)
  @Post('confirm-email')
  async confirmEmail(
    @Req() req: I_Request,
    @Body() body: ConfirmEmailDto,
  ) {
    await this.authService.confirmEmail(req, body);

    return SuccessResponse({
      message: req.t('auth:success.emailVerifiedSuccessfully'),
      info: req.t('auth:success.emailVerifiedSuccessfullyInfo'),
    });
  }



}