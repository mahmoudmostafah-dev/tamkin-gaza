import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CreateCampaignDto } from './Dtos/create-campaign.dto';
import { CampaignService } from './campaign.service';
import { ResponseService } from 'src/Common/Services/Response/response.service';
import { TranslationService } from 'src/Common/Services/Translation/translation.service';
import type { ILanguageRequest } from 'src/Common/Interfaces/Language/language-request.interface';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly responseService: ResponseService,
    private readonly translationService: TranslationService,
  ) {}
  @Post()
  async createCampaign(
    @Req() request: ILanguageRequest,
    @Body() createCampaignDto: CreateCampaignDto,
  ) {
    const userLanguage = request.userLanguage;
    const campaign = await this.campaignService.create(
      createCampaignDto,
      userLanguage,
    );
    return this.responseService.success({
      statusCode: HttpStatus.CREATED,
      message: await this.translationService.translate(
        userLanguage,
        'campaign:success.campaign_created_successfully',
      ),
      data: campaign,
    });
  }
  @Get(':slug')
  async getCampaign(@Param('slug') campaignSlug: string) {
    const campaign = await this.campaignService;
  }
}
