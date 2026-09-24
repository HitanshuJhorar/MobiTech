import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';

async function run() {
  await mongoose.connect('mongodb+srv://mobitech7731_db_user:eop5RQAxxaIunyHR@mobitech.jpfrnze.mongodb.net');
  const admins = await Admin.find().select('+passwordHash');
  console.log('Admins in TEST DB:', admins.map(a => a.email));
  await mongoose.disconnect();
}
run();
