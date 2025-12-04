import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export interface UserData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface SafeUser {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export const authService = {
  async createUser(userData: UserData): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [newUser] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role || 'user',
      })
      .returning();
    
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
    };
  },

  async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    
    return user || null;
  },

  async findUserById(id: number): Promise<SafeUser | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  },

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateUser(id: number, data: Partial<UserData>): Promise<SafeUser | null> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    if (data.role) updateData.role = data.role;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) return null;

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
    };
  },
};
