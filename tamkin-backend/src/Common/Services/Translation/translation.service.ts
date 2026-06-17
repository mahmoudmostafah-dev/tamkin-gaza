import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { LanguageCode } from 'src/Common/Interfaces/Language/languages-config.interface';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  public translate(key: string, args?: any): any {
    return this.i18n.translate(key, {
      lang: I18nContext.current()?.lang,
      args,
    });
  }

  public translateToDefaultLanguage(key: string, args?: any): any {
    return this.i18n.translate(key, { args });
  }

  public getDefaultLanguageCode(): LanguageCode {
    return 'ar' as LanguageCode;
  }
}
