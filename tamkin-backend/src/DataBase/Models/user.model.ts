import {
  UserProviderEnum,
  UserRoleEnum,
} from 'src/Common/Enums/User/user.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { IUser } from 'src/Common/Interfaces/User/user.interface';

@Entity()
export class UserModel implements IUser {
  @PrimaryGeneratedColumn()
  _id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ enum: UserProviderEnum, default: UserProviderEnum.SYSTEM })
  provider: UserProviderEnum;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({ enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Column({ nullable: true })
  nationality?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
