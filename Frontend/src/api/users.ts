import { apiRequest } from '../lib/api';
import type { AppUser } from '../App';

type UserResponse = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
};

const mapUser = (u: UserResponse): AppUser => ({
  id: String(u.id),
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: (u.role || 'USER').toLowerCase() as 'user' | 'admin',
  createdAt: u.createdAt,
});

export async function listUsers(): Promise<AppUser[]> {
  const data = await apiRequest<UserResponse[]>('/api/users');
  return data.map(mapUser);
}

export async function getUser(id: string): Promise<AppUser> {
  const data = await apiRequest<UserResponse>(`/api/users/${id}`);
  return mapUser(data);
}

export async function updateUser(id: string, payload: Partial<{ name: string; phone: string; role: 'user' | 'admin' }>): Promise<AppUser> {
  const dto = await apiRequest<UserResponse>(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, role: payload.role ? payload.role.toUpperCase() : undefined }),
  });
  return mapUser(dto);
}

export async function deleteUser(id: string): Promise<void> {
  await apiRequest<void>(`/api/users/${id}`, { method: 'DELETE' });
}

export async function promoteUser(id: string): Promise<AppUser> {
  const dto = await apiRequest<UserResponse>(`/api/users/${id}/promote`, { method: 'POST' });
  return mapUser(dto);
}

export async function demoteUser(id: string): Promise<AppUser> {
  const dto = await apiRequest<UserResponse>(`/api/users/${id}/demote`, { method: 'POST' });
  return mapUser(dto);
}
