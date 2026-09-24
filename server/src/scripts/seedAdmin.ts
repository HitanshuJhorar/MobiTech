import "dotenv/config";

import mongoose from "mongoose";
import { authService } from "../services/auth.service.js";
import { Admin } from "../models/Admin.js";

async function main(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!mongoUri || !email || !password) {
    console.error("Missing required env vars: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    await mongoose.disconnect();
    return;
  }

  await authService.createAdmin(email, password, name);
  console.log(`Admin created: ${email}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
