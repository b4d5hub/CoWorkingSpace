import { apiRequest } from '../lib/api';
import type { Reservation } from '../App';

type ReservationDTO = {
  id: number;
  userId?: string | null;
  userName: string;
  roomId?: string;
  roomName?: string;
  location?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status: string;
};

export type CreateReservationInput = {
  salleId: number | string;
  client: string; // email or name
  date?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
};

export async function createReservation(payload: CreateReservationInput): Promise<{ reservationId?: number; status?: string; message: string }>
{
  const res = await apiRequest<{ success: boolean; message: string; reservationId?: number; status?: string }>(
    '/api/reservations',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        salleId: typeof payload.salleId === 'string' ? Number(payload.salleId) : payload.salleId,
        client: payload.client,
        date: payload.date,
        startTime: payload.startTime,
        endTime: payload.endTime,
      }),
    }
  );
  return { reservationId: res.reservationId, status: res.status, message: res.message };
}

export async function listReservations(params?: { client?: string; status?: string }): Promise<Reservation[]> {
  const qs = new URLSearchParams();
  if (params?.client) qs.set('client', params.client);
  if (params?.status) qs.set('status', params.status);
  const data = await apiRequest<ReservationDTO[]>(`/api/reservations${qs.toString() ? `?${qs.toString()}` : ''}`);
  return data.map((d) => ({
    id: String(d.id),
    userId: d.userId || '',
    userName: d.userName,
    roomId: d.roomId || '',
    roomName: d.roomName || '',
    location: d.location || '',
    date: d.date || '',
    startTime: d.startTime || '',
    endTime: d.endTime || '',
    status: (d.status || 'confirmed').toLowerCase() as Reservation['status'],
  }));
}

export async function cancelReservation(id: string | number): Promise<void> {
  await apiRequest(`/api/reservations/${id}/cancel`, { method: 'POST' });
}

export async function approveReservation(id: string | number): Promise<void> {
  await apiRequest(`/api/reservations/${id}/approve`, { method: 'POST' });
}

export async function rejectReservation(id: string | number): Promise<void> {
  await apiRequest(`/api/reservations/${id}/reject`, { method: 'POST' });
}
