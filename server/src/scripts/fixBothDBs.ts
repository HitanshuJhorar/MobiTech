import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { authService } from '../services/auth.service.js';

async function syncDb(uri: string) {
  await mongoose.connect(uri);
  await Admin.deleteMany({ email: 'mobimart@gmail.com' });
  const newEmail = 'mobitech7731@gmail.com';
  const newPass = 'mobitech@7733';
  const existing = await Admin.findOne({ email: newEmail });
  if (!existing) {
    await authService.createAdmin(newEmail, newPass, 'Mobitech Admin');
  } else {
    const { hashPassword } = await import('../utils/password.js');
    const hash = await hashPassword(newPass);
    await Admin.updateOne({ email: newEmail }, { passwordHash: hash });
  }
  await mongoose.disconnect();
}

async function run() {
  console.log('Syncing test db...');
  await syncDb('mongodb+srv://mobitech7731_db_user:eop5RQAxxaIunyHR@mobitech.jpfrnze.mongodb.net');
  console.log('Syncing mobitech db...');
  await syncDb('mongodb+srv://mobitech7731_db_user:eop5RQAxxaIunyHR@mobitech.jpfrnze.mongodb.net/mobitech?retryWrites=true&w=majority');
  console.log('Done');
}
run();
