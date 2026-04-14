import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CampaignStatus } from '../Enums/campaign-status.enum';
import { SUPPORTED_LANGUAGES } from 'src/Config/languages.config';
import { i18nValidationMessage } from 'nestjs-i18n';
export class CampaignDto {
  @IsObject({
    message: i18nValidationMessage('campaign:errors.validation.titleFormatError', {
      langs: SUPPORTED_LANGUAGES.join(', '),
    }),
  })
  @ValidateNested()
  title!: Record<(typeof SUPPORTED_LANGUAGES)[number], string>;

  @IsObject()
  @ValidateNested()
  description!: Record<(typeof SUPPORTED_LANGUAGES)[number], string>;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  target_amount!: number;

  @IsString()
  @IsOptional()
  image!: string;

  @IsEnum(CampaignStatus)
  @IsOptional()
  status!: CampaignStatus;
}
