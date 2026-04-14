import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from '../Enums/User/user.enum';
import { TokenTypeEnum } from '../Enums/token.enum';
import { SetAccessRoles } from './roles.decorator';
import { SetTokenType } from './token.decorator';
import { AuthenticationGuard } from '../Guards/Authentication/authentication.guard';
import { AuthorizationGuard } from '../Guards/Authorization/authorization.guard';

export function Auth(
  accessRoles: UserRoleEnum[] = [],
  tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS,
) {
  return applyDecorators(
    SetAccessRoles(accessRoles),
    SetTokenType(tokenType),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
