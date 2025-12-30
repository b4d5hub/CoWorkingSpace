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
  // Optional per-hour price; backend may or may not provide this
  pricePerHour?: number | string;
  // Some backends may use alternative keys; we will coerce below via fallbacks
  price?: number | string;
  hourlyRate?: number | string;
  tarifHoraire?: number | string;
  prixParHeure?: number | string;
};

function coerceNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (!isNaN(n) && isFinite(n)) return n;
  }
  return undefined;
}

function extractPricePerHour(d: Partial<RoomDTO>): number | undefined {
  const candidate =
    (d as any).pricePerHour ?? (d as any).price_per_hour ?? (d as any).price ?? (d as any).hourlyRate ?? (d as any).tarifHoraire ?? (d as any).prixParHeure;
  const n = coerceNumber(candidate);
  // Allow 0 as a valid number (free rooms), return undefined only when truly absent/invalid
  return typeof n === 'number' ? n : undefined;
}

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
      pricePerHour: extractPricePerHour(d),
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
      pricePerHour: extractPricePerHour(d),
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
    pricePerHour: extractPricePerHour(dto),
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
    pricePerHour: extractPricePerHour(dto),
  };
}

export async function deleteRoom(id: string): Promise<void> {
  await apiRequest<void>(`/api/rooms/${id}`, { method: 'DELETE' });
}
