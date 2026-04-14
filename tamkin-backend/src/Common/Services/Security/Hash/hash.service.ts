import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { createHmac } from 'node:crypto';

@Injectable()
export class HashingService {
  constructor(private configService: ConfigService) {}
  private saltOverride = 10;
  async hashPassword(text: string): Promise<string> {
    const defaultSalt = this.configService.get<number>('HASH_SALT', 10);
    const salt = this.saltOverride || defaultSalt;

    return await bcrypt.hash(text, Number(salt));
  }

  async compare(plainText: string, hashText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashText);
  }

  hashEmail(email: string): string {
    const secret = this.configService.get<string>('EMAIL_HASH_SECRET');
    if (!secret)
      throw new InternalServerErrorException('EMAIL_HASH_SECRET is not set');

    return this.generateHash(email, secret);
  }

  hashToken(token: string): string {
    const secret = this.configService.get<string>('TOKEN_HASH_SECRET');
    if (!secret)
      throw new InternalServerErrorException('TOKEN_HASH_SECRET is not set');

    return this.generateHash(token, secret);
  }
  generateHash(text: string, secret: string = process.env.CRYPTO_KEY || 'secret') {
    return createHmac('sha256', secret).update(text).digest('hex');
  }
}
