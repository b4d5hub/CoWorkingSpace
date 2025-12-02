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
import { ArrowLeft, CheckCircle, XCircle, MapPin, Calendar as CalendarIcon, Clock, DoorOpen } from 'lucide-react';
import type { Reservation } from '../App';
import { toast } from 'sonner@2.0.3';

type AdminValidateProps = {
  reservations: Reservation[];
  onApprove: (reservationId: string) => void;
  onReject: (reservationId: string) => void;
  onCancel?: (reservationId: string) => void;
  onBack: () => void;
};

export function AdminValidate({ reservations, onApprove, onReject, onCancel, onBack }: AdminValidateProps) {
  // With auto-approval, only two statuses remain visible to the admin: confirmed and rejected
  const confirmedReservations = reservations.filter((r) => r.status === 'confirmed');
  const rejectedReservations = reservations.filter((r) => r.status === 'cancelled');

  // Keep handlers in case the backend flow re-introduces manual approvals later
  const handleApprove = (reservation: Reservation) => {
    onApprove(reservation.id);
    toast.success('Reservation approved', {
      description: `${reservation.roomName} reservation confirmed`,
    });
  };

  const handleReject = (reservation: Reservation) => {
    onReject(reservation.id);
    toast.success('Reservation rejected', {
      description: `${reservation.roomName} booking cancelled`,
    });
  };

  const isUpcoming = (res: Reservation) => {
    // Consider upcoming only if start time is in the future (Edge Rule handled by backend)
    try {
      if (!res.date) return false;
      const dateStr = res.date;
      const startStr = res.startTime || '00:00';
      const start = new Date(`${dateStr}T${startStr}:00`);
      return start.getTime() > Date.now();
    } catch {
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="text-foreground hover:text-foreground/70">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-foreground mb-2">Reservation Management</h1>
        <p className="text-muted-foreground">Review and manage confirmed or rejected reservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl text-foreground">{confirmedReservations.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Confirmed bookings
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl text-foreground">{rejectedReservations.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <XCircle className="w-4 h-4 text-red-600" />
              Cancelled bookings
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmed Reservations (with admin cancel for upcoming) */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Confirmed Reservations
          </CardTitle>
          <CardDescription>
            {confirmedReservations.length} confirmed {confirmedReservations.length === 1 ? 'booking' : 'bookings'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {confirmedReservations.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Room</TableHead>
                    <TableHead className="text-muted-foreground">Branch</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Time</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {confirmedReservations.map((reservation) => (
                    <TableRow key={reservation.id} className="border-border">
                      <TableCell className="text-foreground">{reservation.userName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DoorOpen className="w-3 h-3 text-foreground" />
                          <span className="text-foreground">{reservation.roomName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-foreground" />
                          <span className="text-foreground">{reservation.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground text-sm">
                          <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                          {formatDate(reservation.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground text-sm">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {reservation.startTime} - {reservation.endTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isUpcoming(reservation) && onCancel ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <XCircle className="w-3 h-3 mr-1" /> Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Cancel Upcoming Reservation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel the reservation for{' '}
                                  <span className="font-medium text-foreground">{reservation.roomName}</span> on{' '}
                                  <span className="font-medium text-foreground">{formatDate(reservation.date)}</span>?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-border">Keep</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    onCancel(reservation.id);
                                    toast.success('Reservation cancelled', { description: 'The upcoming reservation has been cancelled.' });
                                  }}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Cancel Reservation
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No confirmed reservations.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Reservations History */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Reservation History</CardTitle>
          <CardDescription>
            All reservations across the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Room</TableHead>
                  <TableHead className="text-muted-foreground">Branch</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Time</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.length > 0 ? (
                  reservations.map((reservation) => (
                    <TableRow key={reservation.id} className="border-border">
                      <TableCell className="text-foreground">{reservation.userName}</TableCell>
                      <TableCell className="text-foreground">{reservation.roomName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-foreground">{reservation.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-foreground text-sm">{formatDate(reservation.date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-foreground text-sm">
                            {reservation.startTime} - {reservation.endTime}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {reservation.status === 'confirmed' && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/30" variant="outline">
                            Confirmed
                          </Badge>
                        )}
                        {reservation.status === 'pending' && (
                          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30" variant="outline">
                            Pending
                          </Badge>
                        )}
                        {reservation.status === 'cancelled' && (
                          <Badge className="bg-red-500/10 text-red-600 border-red-500/30" variant="outline">
                            Cancelled
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No reservations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
