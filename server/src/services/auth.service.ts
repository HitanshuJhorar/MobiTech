import { Admin, IAdmin } from "../models/Admin.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; admin: Partial<IAdmin> } | null> {
    // Select passwordHash explicitly (field has select: false)
    const admin = await Admin.findOne({ email }).select("+passwordHash");
    if (!admin || !admin.isActive) return null;

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) return null;

    const token = signToken((admin._id as { toString(): string }).toString());

    return {
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name } as Partial<IAdmin>,
    };
  },

  async createAdmin(email: string, password: string, name: string): Promise<IAdmin> {
    const passwordHash = await hashPassword(password);
    return Admin.create({ email, passwordHash, name });
  },
};
