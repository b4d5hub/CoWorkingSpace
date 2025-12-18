import { apiRequest } from '../lib/api';
import type { Room } from '../App';

type RoomDTO = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  amenities?: string[];
  imageUrl?: string;
  available: boolean;
  pricePerHour?: number | string;
};

export async function listRooms(): Promise<Room[]> {
  try {
    const data = await apiRequest<RoomDTO[]>('/api/rooms');
    return data.map((d) => ({
      id: String(d.id),
      name: d.name,
      location: d.location || 'Unknown',
      capacity: d.capacity,
      amenities: d.amenities ?? [],
      imageUrl:
        d.imageUrl ||
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      available: typeof d.available === 'boolean' ? d.available : true,
      pricePerHour: d.pricePerHour !== undefined && d.pricePerHour !== null ? Number(d.pricePerHour) : undefined,
    }));
  } catch (primaryErr) {
    console.warn('[rooms] /api/rooms failed, falling back to /api/salles', primaryErr);
    // Fallback to legacy endpoint (RMI-backed) if available
    const alt = await apiRequest<RoomDTO[]>('/api/salles');
    return alt.map((d) => ({
      id: String(d.id),
      name: d.name,
      location: d.location || 'Unknown',
      capacity: d.capacity,
      amenities: d.amenities ?? [],
      imageUrl:
        d.imageUrl ||
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      available: typeof d.available === 'boolean' ? d.available : true,
      pricePerHour: d.pricePerHour !== undefined && d.pricePerHour !== null ? Number(d.pricePerHour) : undefined,
    }));
  }
}

export type UpsertRoomInput = Omit<Room, 'id'>;

export async function createRoom(payload: UpsertRoomInput): Promise<Room> {
  const dto = await apiRequest<RoomDTO>('/api/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return {
    id: String(dto.id),
    name: dto.name,
    location: dto.location,
    capacity: dto.capacity,
    amenities: dto.amenities ?? [],
    imageUrl: dto.imageUrl || '',
    available: dto.available,
    pricePerHour: dto.pricePerHour !== undefined && dto.pricePerHour !== null ? Number(dto.pricePerHour) : undefined,
  };
}

export async function updateRoom(id: string, payload: Partial<UpsertRoomInput>): Promise<Room> {
  const dto = await apiRequest<RoomDTO>(`/api/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return {
    id: String(dto.id),
    name: dto.name,
    location: dto.location,
    capacity: dto.capacity,
    amenities: dto.amenities ?? [],
    imageUrl: dto.imageUrl || '',
    available: dto.available,
    pricePerHour: dto.pricePerHour !== undefined && dto.pricePerHour !== null ? Number(dto.pricePerHour) : undefined,
  };
}

export async function deleteRoom(id: string): Promise<void> {
  await apiRequest<void>(`/api/rooms/${id}`, { method: 'DELETE' });
}
