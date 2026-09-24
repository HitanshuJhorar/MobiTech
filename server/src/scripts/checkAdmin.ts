import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { authService } from '../services/auth.service.js';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const admins = await Admin.find().select('+passwordHash');
  console.log('Admins in DB:', admins.map(a => a.email));

  const email = 'mobitech7731@gmail.com';
  const pass = 'mobitech@7733';
  const loginResult = await authService.login(email, pass);
  if (loginResult) {
    console.log('Login successful via authService!');
  } else {
    console.log('Login FAILED via authService!');
  }
  await mongoose.disconnect();
}
run();
