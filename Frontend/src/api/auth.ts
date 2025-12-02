import { apiRequest } from '../lib/api';
import type { User } from '../App';

type UserResponse = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
};

export async function register(name: string, email: string, password: string, phone?: string): Promise<User> {
  const payload: any = { name, email, password };
  if (phone && phone.trim().length > 0) payload.phone = phone.trim();
  const res = await apiRequest<UserResponse>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return {
    id: String(res.id),
    name: res.name,
    email: res.email,
    phone: res.phone,
    role: (res.role || 'USER').toLowerCase() as 'user' | 'admin',
  };
}

export async function login(email: string, password: string): Promise<User> {
  const res = await apiRequest<UserResponse>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return {
    id: String(res.id),
    name: res.name,
    email: res.email,
    phone: res.phone,
    role: (res.role || 'USER').toLowerCase() as 'user' | 'admin',
  };
}
