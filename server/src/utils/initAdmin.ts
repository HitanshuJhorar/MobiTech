import { Admin } from '../models/Admin.js';
import { authService } from '../services/auth.service.js';
import { hashPassword } from '../utils/password.js';

export async function initAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) return;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      const newHash = await hashPassword(password);
      await Admin.updateOne({ email }, { passwordHash: newHash, name });
      console.log('Admin updated:', email);
    } else {
      await authService.createAdmin(email, password, name);
      console.log('Admin created:', email);
    }
  } catch (err) {
    console.error('Failed to init admin:', err);
  }
}
