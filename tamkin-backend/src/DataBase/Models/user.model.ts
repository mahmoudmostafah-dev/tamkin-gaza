import { UserProviderEnum, UserRoleEnum } from "src/Common/Enums/User/user.enum";
import { IUser } from "src/Common/Interfaces/User/user.interface";
import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Expose } from "class-transformer";


@Entity()
export class UserModel implements IUser {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ unique: true })
  @Generated('uuid')
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
