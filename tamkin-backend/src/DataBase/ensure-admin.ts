import { DataSource } from 'typeorm';
import { HashingService } from '../Common/Services/Security/Hash/hash.service';
import { UserModel } from './Models/user.model';
import { UserRoleEnum, UserProviderEnum } from '../Common/Enums/User/user.enum';

export async function ensureAdmin(dataSource: DataSource, hashingService: HashingService) {
  const userRepository = dataSource.getRepository(UserModel);
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@tamkin.com';
  let admin = await userRepository.findOne({ where: { email: adminEmail } });
  if (!admin) {
    console.log('Creating Admin User...');
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPassword123!';
    admin = userRepository.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: adminEmail,
      emailVerified: true,
      provider: UserProviderEnum.SYSTEM,
      password: await hashingService.generateHash({ text: adminPassword }),
      role: UserRoleEnum.SUPER_ADMIN,
    });
    await userRepository.save(admin);
  } else {
    console.log('Admin User already exists. Skipping...');
  }
}
