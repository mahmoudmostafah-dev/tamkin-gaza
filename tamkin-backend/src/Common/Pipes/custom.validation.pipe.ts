import { Injectable } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ResponseService } from '../Services/Response/response.service';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(private readonly responseService: ResponseService) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          path: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        return responseService.badRequest({
          message: 'Validation failed',
          info: 'One or more fields contain invalid data',
          issues: formattedErrors,
        });
      },
    });
  }
}
