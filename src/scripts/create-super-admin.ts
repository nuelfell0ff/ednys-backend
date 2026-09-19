import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { connectDatabase } from '../config/database';
import {
  User,
  UserRole,
} from '../modules/users/user.model';

dotenv.config();

const createSuperAdmin = async (): Promise<void> => {
  const name =
    process.env.SUPER_ADMIN_NAME;

  const email =
    process.env.SUPER_ADMIN_EMAIL
      ?.toLowerCase()
      .trim();

  const password =
    process.env.SUPER_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      'SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be defined'
    );
  }

  if (password.length < 8) {
    throw new Error(
      'SUPER_ADMIN_PASSWORD must be at least 8 characters'
    );
  }

  await connectDatabase();

  const existingUser =
    await User.findOne({ email });

  if (existingUser) {
    if (
      existingUser.role ===
      UserRole.SUPER_ADMIN
    ) {
      console.log(
        'Super Admin already exists.'
      );
    } else {
      console.log(
        'A user with this email already exists.'
      );
    }

    process.exit(0);
  }

  const passwordHash =
    await bcrypt.hash(password, 12);

  const superAdmin =
    await User.create({
      name: name.trim(),
      email,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    });

  console.log(
    `Super Admin created: ${superAdmin.email}`
  );

  process.exit(0);
};

void createSuperAdmin();