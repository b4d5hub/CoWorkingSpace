import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Wifi,
  Monitor,
  Coffee,
  Video,
  Search,
  Filter,
  Server,
  MoreHorizontal,
} from 'lucide-react';
import type { Room, Reservation } from '../App';
import { formatPricePerHour } from '../lib/pricing';

type DashboardProps = {
  rooms: Room[];
  reservations: Reservation[];
  onSelectRoom: (room: Room) => void;
  initialLocation?: string;
  onLocationChange?: (location: string) => void;
};

export function Dashboard({ rooms, reservations, onSelectRoom, initialLocation = 'all', onLocationChange }: DashboardProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation);
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedLocation(initialLocation);
  }, [initialLocation]);

  const locations = ['all', ...Array.from(new Set(rooms.map((room) => room.location)))];

  const filteredRooms = rooms.filter((room) => {
    const matchesLocation = selectedLocation === 'all' || room.location === selectedLocation;
    const matchesCapacity =
      selectedCapacity === 'all' ||
      (selectedCapacity === 'small' && room.capacity <= 6) ||
      (selectedCapacity === 'medium' && room.capacity > 6 && room.capacity <= 10) ||
      (selectedCapacity === 'large' && room.capacity > 10);
    const matchesSearch =
      searchQuery === '' ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLocation && matchesCapacity && matchesSearch;
  });

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('video') || lowerAmenity.includes('conference')) {
      return <Video className="w-4 h-4" />;
    }
    if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) {
      return <Wifi className="w-4 h-4" />;
    }
    if (lowerAmenity.includes('monitor') || lowerAmenity.includes('screen') || lowerAmenity.includes('tv') || lowerAmenity.includes('projector')) {
      return <Monitor className="w-4 h-4" />;
    }
    if (lowerAmenity.includes('coffee')) {
      return <Coffee className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2">Room Availability Dashboard</h1>
        <p className="text-muted-foreground">Browse and book meeting rooms across all locations</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Filter className="w-5 h-5 text-foreground" />
            Filter Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Location</label>
              <Select value={selectedLocation} onValueChange={(val) => { setSelectedLocation(val); onLocationChange?.(val); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Capacity</label>
              <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Capacities</SelectItem>
                  <SelectItem value="small">Small (1-6)</SelectItem>
                  <SelectItem value="medium">Medium (7-10)</SelectItem>
                  <SelectItem value="large">Large (11+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const maxVisibleAmenities = 3;
          const visibleAmenities = room.amenities.slice(0, maxVisibleAmenities);
          const remainingAmenities = room.amenities.slice(maxVisibleAmenities);
          const hasMoreAmenities = remainingAmenities.length > 0;

          return (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-foreground/20 group flex flex-col h-full">
              <div className="aspect-video w-full overflow-hidden bg-muted relative">
                <ImageWithFallback
                  src={room.imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground">{room.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {room.location}
                    </CardDescription>
                    {room.pricePerHour !== undefined && (
                      <div className="mt-1 text-sm text-foreground">{formatPricePerHour(room.pricePerHour)}</div>
                    )}
                  </div>
                  {room.available ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/30" variant="outline">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-1.5"></span>
                      Available
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-600 border-red-500/30" variant="outline">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-1.5"></span>
                      Reserved
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Capacity: {room.capacity} people</span>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-foreground mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {visibleAmenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </Badge>
                    ))}
                    {hasMoreAmenities && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-6 px-2"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-card border-border">
                          <div className="space-y-2">
                            <h4 className="text-sm text-foreground mb-3">All Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {room.amenities.map((amenity, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {getAmenityIcon(amenity)}
                                  <span>{amenity}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => onSelectRoom(room)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 mt-auto"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Select Time
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No rooms found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
