import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenTypeEnum } from 'src/Common/Enums/token.enum';
import { ResponseService } from 'src/Common/Services/Response/response.service';
import { TokenService } from 'src/Common/Services/Security/token.service';
import { I_Request } from 'src/Common/Types/request.types';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly responseService: ResponseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: any | I_Request = context.switchToHttp().getRequest();

    let authorization: string = '';

    switch (context.getType()) {
      /*       case "ws":
              break;
       */
      default:
        req = context.switchToHttp().getRequest();
        break;
    }

    authorization = req.cookies['access_token'];

    if (!authorization || authorization === '') {
      throw this.responseService.forbidden({
        message: req.t(
          'token:errors.you_are_not_authorized_to_access_this_resource',
        ),
        info: req.t('token:errors.authorization_header_missing'),
      });
    }

    const { user, decoded } = await this.tokenService.decodeToken(
      authorization,
      TokenTypeEnum.ACCESS,
    );

    req.user = user;
    req.decoded = decoded;

    return true;
  }
}
