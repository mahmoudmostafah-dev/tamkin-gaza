import { Injectable } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ResponseService } from 'src/Common/Services/Response/response.service';
import { TranslationService } from 'src/Common/Services/Translation/translation.service';
import { Request } from 'express';
import { ILanguageRequest } from 'src/Common/Interfaces/Language/language-request.interface';
import { IRequest } from 'src/Common/Types/request.types';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly translationService: TranslationService,
  ) {}

  verifyGmailAccount = async (id_token: string, req: IRequest): Promise<TokenPayload> => {
    try {
      const client = new OAuth2Client();

      let ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.WEB_CLIENT_ID as string,
      });

      const payload = ticket.getPayload();

      if (!payload?.email_verified) {
        const userLang = (req as ILanguageRequest).userLanguage;
        throw this.responseService.badRequest({
          message: this.translationService.translate(
            'auth:errors.fail_to_Verify_this_token',
            userLang,
          ),
          info: this.translationService.translate(
            'auth:errors.fail_to_verify_this_account',
            userLang,
          ),
        });
      }

      return payload;
    } catch (error: any) {
      const userLang = (req as ILanguageRequest).userLanguage;
      if (error.message.startsWith('Invalid argument: id_token')) {
        throw this.responseService.badRequest({
          message: this.translationService.translate(
            'auth:errors.fail_to_Verify_this_token',
            userLang,
          ),
          info: 'Invalid argument: id_token',
        });
      } else if (error.message.startsWith('Token used too late')) {
        throw this.responseService.badRequest({
          message: this.translationService.translate(
            'auth:errors.fail_to_Verify_this_token',
            userLang,
          ),
          info: this.translationService.translate('auth:errors.token_used_too_late', userLang),
        });
      } else {
        throw this.responseService.badRequest({
          message: this.translationService.translate(
            'auth:errors.fail_to_Verify_this_token',
            userLang,
          ),
        });
      }
    }
  };
}
