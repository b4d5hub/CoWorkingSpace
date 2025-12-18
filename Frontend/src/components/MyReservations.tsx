import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Calendar, Clock, MapPin, XCircle, CheckCircle2 } from 'lucide-react';
import type { Reservation, Room } from '../App';
import { calculateHours, calculateTotalPrice, formatMoney, formatPricePerHour } from '../lib/pricing';

type MyReservationsProps = {
  reservations: Reservation[];
  rooms?: Room[];
  onCancel: (reservationId: string) => void;
};

export function MyReservations({ reservations, rooms = [], onCancel }: MyReservationsProps) {
  const activeReservations = reservations.filter((r) => r.status === 'confirmed');
  const cancelledReservations = reservations.filter((r) => r.status === 'cancelled');

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isUpcoming = (dateString: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-foreground mb-2">My Reservations</h1>
        <p className="text-muted-foreground">View and manage your room bookings</p>
      </div>

      {/* Pending section removed as reservations are auto-approved under capacity */}

      {/* Active Reservations */}
      <Card className="mb-6 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Active Reservations
          </CardTitle>
          <CardDescription>
            {activeReservations.length} active {activeReservations.length === 1 ? 'booking' : 'bookings'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeReservations.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.roomName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {reservation.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {formatDate(reservation.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {(reservation.startTime || '-')}{reservation.endTime ? ` - ${reservation.endTime}` : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const room = rooms.find((r) => r.id === reservation.roomId);
                            const hours = calculateHours(reservation.startTime, reservation.endTime);
                            const total = calculateTotalPrice(room?.pricePerHour, hours);
                            if (!room?.pricePerHour) {
                              return <span className="text-muted-foreground">N/A</span>;
                            }
                            return (
                              <div className="text-sm text-foreground">
                                <div>Price/hr: {formatPricePerHour(room.pricePerHour)}</div>
                                <div>Hours: {formatMoney(hours)}</div>
                                <div className="font-medium">Total: {formatMoney(total)}</div>
                              </div>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              isUpcoming(reservation.date)
                                ? 'bg-blue-100 text-blue-700 border-blue-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }
                            variant="outline"
                          >
                            {isUpcoming(reservation.date) ? 'Upcoming' : 'Past'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isUpcoming(reservation.date) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel your reservation for{' '}
                                    <span className="font-medium">{reservation.roomName}</span> on{' '}
                                    <span className="font-medium">{formatDate(reservation.date)}</span>?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onCancel(reservation.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Cancel Reservation
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {activeReservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{reservation.roomName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {reservation.location}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            isUpcoming(reservation.date)
                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }
                          variant="outline"
                        >
                          {isUpcoming(reservation.date) ? 'Upcoming' : 'Past'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(reservation.date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {(reservation.startTime || '-')}{reservation.endTime ? ` - ${reservation.endTime}` : ''}
                      </div>
                      {/* Pricing breakdown (mobile) */}
                      {(() => {
                        const room = rooms.find((r) => r.id === reservation.roomId);
                        const hours = calculateHours(reservation.startTime, reservation.endTime);
                        const total = calculateTotalPrice(room?.pricePerHour, hours);
                        return (
                          <div className="mt-2 p-3 bg-muted rounded-sm border border-border text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Price/hr</span>
                              <span className="text-foreground">{formatPricePerHour(room?.pricePerHour)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Hours</span>
                              <span className="text-foreground">{formatMoney(hours)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Total</span>
                              <span className="text-foreground font-medium">{formatMoney(total)}</span>
                            </div>
                          </div>
                        );
                      })()}
                      {isUpcoming(reservation.date) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="w-full">
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Reservation
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel your reservation for{' '}
                                <span className="font-medium">{reservation.roomName}</span> on{' '}
                                <span className="font-medium">{formatDate(reservation.date)}</span>?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onCancel(reservation.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Cancel Reservation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active reservations</p>
              <p className="text-sm text-gray-400 mt-1">Book a room to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancelled Reservations */}
      {cancelledReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-gray-400" />
              Cancelled Reservations
            </CardTitle>
            <CardDescription>
              {cancelledReservations.length} cancelled {cancelledReservations.length === 1 ? 'booking' : 'bookings'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancelledReservations.map((reservation) => (
                    <TableRow key={reservation.id} className="opacity-60">
                      <TableCell>{reservation.roomName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {reservation.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {formatDate(reservation.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {(reservation.startTime || '-')}{reservation.endTime ? ` - ${reservation.endTime}` : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-700 border-red-300" variant="outline">
                          Cancelled
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-4">
              {cancelledReservations.map((reservation) => (
                <Card key={reservation.id} className="opacity-60">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{reservation.roomName}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {reservation.location}
                        </CardDescription>
                      </div>
                      <Badge className="bg-red-100 text-red-700 border-red-300" variant="outline">
                        Cancelled
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(reservation.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {(reservation.startTime || '-')}{reservation.endTime ? ` - ${reservation.endTime}` : ''}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}