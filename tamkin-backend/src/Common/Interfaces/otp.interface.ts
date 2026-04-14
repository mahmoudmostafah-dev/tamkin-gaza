import { E_OTPStatus, E_OTPType } from "../Enums/otp.enum";

export interface I_OTP {

    userId: number;

    code: string; // 6 characters hashed

    type: E_OTPType;

    status: E_OTPStatus;

    expiresAt: Date; // 15 minutes

    usedAt?: Date;

    attemptsCount: number; // max 3 times

    blockedUntil?: Date; // 1 hour

    resendCount: number; // max 3 resends per hour

    resendAvailableAt?: Date; // cooldown between resends

    deleteIn: Date; // 1 day of creation
}
