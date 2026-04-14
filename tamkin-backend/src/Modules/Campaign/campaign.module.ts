import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { Campaign } from 'src/DataBase/Campaign/campaign.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from 'src/Common/Services/Response/response.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  controllers: [CampaignController],
  providers: [CampaignService, ResponseService],
})
export class CampaignModule {}
