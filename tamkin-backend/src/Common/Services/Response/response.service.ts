import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExceptionOptions, IResponse } from '../../Interfaces/Response/response.interface';

@Injectable()
export class ResponseService {
  success<T = any>({
    message = 'Operation successful',
    info,
    statusCode = HttpStatus.OK,
    data,
  }: IResponse<T> = {}): IResponse<T> {
    return { message, info, statusCode, data };
  }

  private createErrorPayload(
    name: string,
    statusCode: number,
    options: ExceptionOptions,
  ) {
    return {
      name,
      statusCode,
      message: options.message || name,
      info: options.info,
      issues: options.issues,
      timestamp: new Date().toISOString(),
    };
  }

  badRequest(options: ExceptionOptions = {}) {
    throw new BadRequestException(
      this.createErrorPayload(
        'BadRequestException',
        HttpStatus.BAD_REQUEST,
        options,
      ),
    );
  }

  notFound(options: ExceptionOptions = {}) {
    throw new NotFoundException(
      this.createErrorPayload(
        'NotFoundException',
        HttpStatus.NOT_FOUND,
        options,
      ),
    );
  }

  forbidden(options: ExceptionOptions = {}) {
    throw new ForbiddenException(
      this.createErrorPayload(
        'ForbiddenException',
        HttpStatus.FORBIDDEN,
        options,
      ),
    );
  }

  conflict(options: ExceptionOptions = {}) {
    throw new ConflictException(
      this.createErrorPayload(
        'ConflictException',
        HttpStatus.CONFLICT,
        options,
      ),
    );
  }

  unauthorized(options: ExceptionOptions = {}) {
    throw new UnauthorizedException(
      this.createErrorPayload(
        'UnauthorizedException',
        HttpStatus.UNAUTHORIZED,
        options,
      ),
    );
  }

  serverError(options: ExceptionOptions = {}) {
    throw new InternalServerErrorException(
      this.createErrorPayload(
        'InternalServerErrorException',
        HttpStatus.INTERNAL_SERVER_ERROR,
        options,
      ),
    );
  }
}
