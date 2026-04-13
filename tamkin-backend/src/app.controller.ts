import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';
import { E_UserRole } from './Common/Enums/user.enums';
import { Auth } from './Common/Decorators/auth.decorator';
import { E_TokenType } from './Common/Enums/token.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Auth([E_UserRole.SUPER_ADMIN], E_TokenType.ACCESS)
  @Get()
  main(@Req() req: Request) {
    return this.appService.main(req);
  }

}