import { Injectable, Logger } from '@nestjs/common';
import { getTransporter } from './Config/email.config';
import { E_EmailSubject } from './email.subjects';
import { E_OTPType } from 'src/Common/Enums/otp.enum';
import { ErrorResponse } from 'src/Common/Utils/Response/error.response';
import {
  confirmEmailTemplate,
  disableTwoFATemplate,
  enableTwoFATemplate,
  loginOtpTemplate,
  resetPasswordOtpTemplate,
  updateEmailOtpTemplate,
} from './email.templates';

type TFunction = (key: string) => string;

@Injectable()
export class EmailService {

  constructor(private readonly error: ErrorResponse) { }

  private async sendEmail({
    to,
    subject,
    html,
    t,
  }: {
    to: string;
    subject: string;
    html: string;
    t: TFunction;
  }) {
    let transporter: ReturnType<typeof getTransporter>;

    try {
      transporter = getTransporter();
    } catch {
      throw this.error.serverError({
        message: t('email:errors.emailConfigMissing'),
        info: t('email:errors.emailConfigMissingInfo'),
      });
    }

    try {
      return await transporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.APP_EMAIL}>`,
        to,
        subject,
        html,
      });
    } catch (sendError: any) {

      throw this.error.serverError({
        message: t('email:errors.failToSendEmail'),
        info: t('email:errors.failToSendEmailInfo'),
      })

    }
  }

  async sendOtpEmail({
    email,
    userName,
    OTP,
    type,
    t,
  }: {
    email: string;
    userName: string;
    OTP: string;
    type: E_OTPType;
    t: TFunction;
  }) {
    const templates: Record<E_OTPType, { subject: string; html: string }> = {
      [E_OTPType.CONFIRM_EMAIL]: {
        subject: E_EmailSubject.CONFIRM_EMAIL,
        html: confirmEmailTemplate({ userName, OTP }),
      },
      [E_OTPType.RESET_PASSWORD]: {
        subject: E_EmailSubject.RESET_PASSWORD,
        html: resetPasswordOtpTemplate({ userName, OTP }),
      },
      [E_OTPType.LOGIN_OTP]: {
        subject: E_EmailSubject.LOGIN_OTP,
        html: loginOtpTemplate({ userName, OTP }),
      },
      [E_OTPType.ENABLE_2FA]: {
        subject: E_EmailSubject.ENABLE_2FA,
        html: enableTwoFATemplate({ userName, OTP }),
      },
      [E_OTPType.DISABLE_2FA]: {
        subject: E_EmailSubject.DISABLE_2FA,
        html: disableTwoFATemplate({ userName, OTP }),
      },
      [E_OTPType.UPDATE_EMAIL]: {
        subject: E_EmailSubject.UPDATE_EMAIL,
        html: updateEmailOtpTemplate({ userName, OTP }),
      },
    };

    const { subject, html } = templates[type];
    await this.sendEmail({ to: email, subject, html, t });

    return true;
  }
}