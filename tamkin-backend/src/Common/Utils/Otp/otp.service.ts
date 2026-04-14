import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpModel } from 'src/DataBase/Models/otp.model';
import { E_OTPStatus, E_OTPType } from 'src/Common/Enums/otp.enum';
import { ErrorResponse } from '../Response/error.response';
import { EmailService } from '../Email/email.service';
import { compareHash, generateHash } from '../Security/hash';

type TFunction = (key: string) => string;

const OTP_EXPIRES_MS = 10 * 60 * 1000;        // 10 minutes
const OTP_DELETE_AFTER_MS = 24 * 60 * 60 * 1000;   // 24 hours
const MAX_RESENDS = 3;
const RESEND_BLOCK_MS = 60 * 60 * 1000;         // 1 hour

@Injectable()
export class OTPService {

  constructor(
    private readonly error: ErrorResponse,
    private readonly emailService: EmailService,
    @InjectRepository(OtpModel)
    private readonly otpRepository: Repository<OtpModel>,
  ) { }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private generateCode(): string {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  }

  private async checkRequestExists({
    userId,
    type,
  }: {
    userId: number;
    type: E_OTPType;
  }) {

    const otp = await this.otpRepository.findOne({
      where: {
        userId,
        type,
        status: E_OTPStatus.ACTIVE,
      }
    }); return otp ? otp : false;

  }

  async sendOTP({
    userId,
    email,
    userName,
    type,
    t,
  }: {
    userId: number;
    email: string;
    userName: string;
    type: E_OTPType;
    t: TFunction;
  }) {


    const requestExists = await this.checkRequestExists({ userId, type });

    if (requestExists) {

      // 1. لو لسه blocked
      if (requestExists.blockedUntil && requestExists.blockedUntil.getTime() > Date.now()) {
        throw this.error.badRequest({
          message: t('auth:errors.confirmEmailOTPBlocked'),
          info: t('auth:errors.confirmEmailOTPBlockedInfo'),
        });
      }

      // 2. limit
      if (requestExists.resendCount >= 3) {
        throw this.error.badRequest({
          message: t('auth:errors.otpTooManyRequests'),
          info: t('auth:errors.otpTooManyRequestsInfo'),
        });
      }

      // 3. update نفس الـ OTP
      const otpCode = this.generateCode();

      requestExists.code = await generateHash({ text: otpCode });
      requestExists.expiresAt = new Date(Date.now() + OTP_EXPIRES_MS);
      requestExists.resendCount += 1;
      requestExists.blockedUntil = new Date(Date.now() + RESEND_BLOCK_MS);

      await this.otpRepository.save(requestExists);

      await this.emailService.sendOtpEmail({
        email,
        userName,
        OTP: otpCode,
        type,
        t,
      });

      return true;
    }

    // أول مرة
    const otpCode = this.generateCode();

    const newOtp = this.otpRepository.create({
      userId,
      code: await generateHash({ text: otpCode }),
      type,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      status: E_OTPStatus.ACTIVE,
      resendCount: 0,
      blockedUntil: new Date(Date.now() + 1 * 60 * 1000),
      deleteIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.otpRepository.save(newOtp);

    const emailSent = await this.emailService.sendOtpEmail({
      email,
      userName,
      OTP: otpCode,
      type,
      t,
    });

    if (!emailSent) {

      await this.otpRepository.delete(newOtp);

      throw this.error.serverError({
        message: t('email:errors.failToSendEmail'),
        info: t('email:errors.failToSendEmailInfo'),
      })
    }

    return true;

  }


  async verifyOTP({
    userId,
    code,
    type,
    t,
  }: {
    userId: number;
    code: string;
    type: E_OTPType;
    t: TFunction;
  }) {

    const otp = await this.checkRequestExists({ userId, type });

    if (!otp) {
      throw this.error.badRequest({
        message: t('auth:errors.otpInvalid'),
        info: t('auth:errors.otpInvalidInfo')
      });
    }

    const isCodeValid = await compareHash({ plainText: code, hashText: otp.code });

    if (!isCodeValid) {
      throw this.error.badRequest({
        message: t('auth:errors.otpInvalid'),
        info: t('auth:errors.otpInvalidInfo')
      });
    }

    otp.status = E_OTPStatus.USED;
    await this.otpRepository.save(otp);

    return true;

  }

}