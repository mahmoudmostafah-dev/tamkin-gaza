import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleAuth } from './Google-Auth/google.auth';
import { CommonModule } from '../../Common/common.module';
import { CookiesService } from 'src/Common/Services/Cookies/cookies.service';
import { TokenService } from 'src/Common/Services/Security/token.service';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuth, TokenService, CookiesService],
  exports: [GoogleAuth],
})
export class AuthModule {}
