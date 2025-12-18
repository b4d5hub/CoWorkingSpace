import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, Clock, MapPin, Users, CheckCircle2, XCircle } from 'lucide-react';
import { calculateHours, calculateTotalPrice, formatMoney, formatPricePerHour } from '../lib/pricing';
import type { Room, User, Reservation } from '../App';

type ReservationFormProps = {
  room: Room;
  user: User;
  onConfirm: (reservation: Omit<Reservation, 'id'>) => void;
  onCancel: () => void;
};

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
];

export function ReservationForm({ room, user, onConfirm, onCancel }: ReservationFormProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onConfirm({
      userId: user.id,
      userName: user.name,
      roomId: room.id,
      roomName: room.name,
      location: room.location,
      date,
      startTime,
      endTime,
      status: 'confirmed',
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (showConfirmation) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-sm flex items-center justify-center border-2 border-green-500/30">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-foreground">Confirm Your Reservation</CardTitle>
            <CardDescription>Please review the details below before confirming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video w-full overflow-hidden rounded-sm bg-muted">
              <ImageWithFallback
                src={room.imageUrl}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                <span className="text-sm text-muted-foreground">Room:</span>
                <span className="text-sm text-foreground">{room.name}</span>
              </div>
              <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="text-sm text-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {room.location}
                </span>
              </div>
              <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm text-foreground">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                <span className="text-sm text-muted-foreground">Time:</span>
                <span className="text-sm text-foreground">{startTime} - {endTime}</span>
              </div>
            </div>

            {/* Pricing breakdown on confirmation */}
            <div className="space-y-3">
              <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                <span className="text-sm text-muted-foreground">Price per hour:</span>
                <span className="text-sm text-foreground">{formatPricePerHour(room.pricePerHour)}</span>
              </div>
              <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                <span className="text-sm text-muted-foreground">Duration (hours):</span>
                <span className="text-sm text-foreground">{formatMoney(calculateHours(startTime, endTime))}</span>
              </div>
              <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="text-sm text-foreground font-medium">
                  {formatMoney(calculateTotalPrice(room.pricePerHour, calculateHours(startTime, endTime)))}
                </span>
              </div>
            </div>

            <div className="p-4 bg-muted border border-border rounded-sm">
              <p className="text-sm text-foreground">
                  You will receive a confirmation once your reservation is finalized.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Booking
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="flex-1 border-border"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="text-foreground hover:text-foreground/70">
          ← Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Details */}
        <Card className="bg-card border-border">
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <ImageWithFallback
              src={room.imageUrl}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-foreground">{room.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {room.location}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">Capacity: {room.capacity} people</span>
            </div>
            <div>
              <p className="text-sm text-foreground mb-2">Amenities:</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/30" variant="outline">
                Available for Booking
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Reservation Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Reserve This Room</CardTitle>
            <CardDescription>Select your preferred date and time</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={getTodayDate()}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Start Time
                </Label>
                <Select value={startTime} onValueChange={setStartTime} required>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  End Time
                </Label>
                <Select value={endTime} onValueChange={setEndTime} required>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots
                      .filter((time) => !startTime || time > startTime)
                      .map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-border">
                {/* Live pricing breakdown while selecting time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                    <span className="text-sm text-muted-foreground">Price per hour</span>
                    <span className="text-sm text-foreground">{formatPricePerHour(room.pricePerHour)}</span>
                  </div>
                  <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                    <span className="text-sm text-muted-foreground">Hours</span>
                    <span className="text-sm text-foreground">{formatMoney(calculateHours(startTime, endTime))}</span>
                  </div>
                  <div className="flex items-start justify-between p-3 bg-muted rounded-sm border border-border">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-sm text-foreground font-medium">
                      {formatMoney(calculateTotalPrice(room.pricePerHour, calculateHours(startTime, endTime)))}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-muted rounded-sm mb-4 border border-border">
                  <div className="text-sm text-foreground">
                    <p>Reservation will be checked for conflicts across all branch servers.</p>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                  disabled={!date || !startTime || !endTime}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Continue to Confirmation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
