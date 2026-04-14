import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './Dtos/create-campaign.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../../DataBase/Campaign/campaign.model';
import { ResponseService } from 'src/Common/Services/Response/response.service';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { CampaignDto } from './Dtos/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    private readonly responseService: ResponseService,
    private readonly i18Service: I18nService,
  ) {}

  private async findByTitle(
    campaignTitle: CampaignDto['title'],
  ): Promise<CampaignDto | null> {
    const campaign = await this.campaignRepository.findOne({
      where: { title: campaignTitle },
    });
    return campaign;
  }
  private async findBySlug(campaignSlug: string): Promise<CampaignDto | null> {
    const campaign = await this.campaignRepository.findOne({
      where: { slug: campaignSlug },
    });
    return campaign;
  }

  async create(createCampaignDto: CreateCampaignDto) {
    const isCampaignExist = await this.findByTitle(createCampaignDto.title);

    if (isCampaignExist)
      throw this.responseService.conflict({
        message: this.i18Service.t('campaign:error.campaignAlreadyExist', {
          lang: I18nContext.current()?.lang,
        }),
      });

    return await this.campaignRepository.create(createCampaignDto);
  }
}
