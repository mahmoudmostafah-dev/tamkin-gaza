import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { I_OTP } from "src/Common/Interfaces/otp.interface";
import { E_OTPStatus, E_OTPType } from "src/Common/Enums/otp.enum";


@Entity()
@Index(["userId", "type"])
export class OtpModel implements I_OTP {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    userId: number;

    @Column()
    code: string;

    @Column({ enum: E_OTPType })
    type: E_OTPType;

    @Column({ enum: E_OTPStatus, default: E_OTPStatus.ACTIVE })
    status: E_OTPStatus;

    @Column({ type: "timestamp" })
    expiresAt: Date;

    @Column({ nullable: true })
    usedAt?: Date;

    @Column({ default: 0 })
    attemptsCount: number;

    @Column({ nullable: true })
    blockedUntil?: Date;

    @Column({ default: 0 })
    resendCount: number;

    @Column({ type: "timestamp", nullable: true })
    resendAvailableAt?: Date;

    @Column({
        type: "timestamp"
    })
    deleteIn: Date;
}