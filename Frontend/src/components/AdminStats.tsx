import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, TrendingUp, Users, DoorOpen, Calendar, BarChart3 } from 'lucide-react';
import type { Room, Reservation, AppUser } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type AdminStatsProps = {
  rooms: Room[];
  reservations: Reservation[];
  users: AppUser[];
  onBack: () => void;
};

export function AdminStats({ rooms, reservations, users, onBack }: AdminStatsProps) {
  // Calculate statistics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.available).length;
  const reservedRooms = totalRooms - availableRooms;
  const occupancyRate = ((reservedRooms / totalRooms) * 100).toFixed(1);

  const confirmedReservations = reservations.filter((r) => r.status === 'confirmed').length;
  // Pending status removed (auto-approval). Keep variable for layout if needed but set to 0.
  const pendingReservations = 0;
  const cancelledReservations = reservations.filter((r) => r.status === 'cancelled').length;

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;
  const regularUsers = users.filter((u) => u.role === 'user').length;

  // Room data by location
  const locationData = ['Agadir', 'Marrakech', 'Casablanca'].map((location) => ({
    name: location,
    total: rooms.filter((r) => r.location === location).length,
    available: rooms.filter((r) => r.location === location && r.available).length,
    reserved: rooms.filter((r) => r.location === location && !r.available).length,
    bookings: reservations.filter((r) => r.location === location && r.status === 'confirmed').length,
  }));

  // Capacity distribution
  const capacityData = [
    {
      name: 'Small (1-6)',
      value: rooms.filter((r) => r.capacity <= 6).length,
    },
    {
      name: 'Medium (7-10)',
      value: rooms.filter((r) => r.capacity > 6 && r.capacity <= 10).length,
    },
    {
      name: 'Large (11+)',
      value: rooms.filter((r) => r.capacity > 10).length,
    },
  ];

  const COLORS = ['#1a1a1a', '#666666', '#999999'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="text-foreground hover:text-foreground/70">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-foreground mb-2">
          Statistics & Analytics
        </h1>
        <p className="text-muted-foreground">System performance and usage metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Room Occupancy</CardDescription>
            <CardTitle className="text-3xl text-foreground">{occupancyRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-green-600" />
              {reservedRooms} of {totalRooms} rooms
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Active Reservations</CardDescription>
            <CardTitle className="text-3xl text-foreground">{confirmedReservations}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Confirmed bookings
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl text-foreground">{totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {adminUsers} admins
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Available Rooms</CardDescription>
            <CardTitle className="text-3xl text-foreground">{availableRooms}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DoorOpen className="w-4 h-4 text-green-600" />
              Ready to book
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Room Distribution by Branch */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Room Distribution by Branch
            </CardTitle>
            <CardDescription>
              Total, available, and reserved rooms per location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '2px',
                      color: '#1a1a1a',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#1a1a1a" name="Total Rooms" />
                  <Bar dataKey="available" fill="#22c55e" name="Available" />
                  <Bar dataKey="reserved" fill="#ef4444" name="Reserved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Room Capacity Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Room Capacity Distribution
            </CardTitle>
            <CardDescription>
              Rooms grouped by capacity size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={capacityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {capacityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '2px',
                      color: '#1a1a1a',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservation Status Breakdown (Pending removed) */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Reservation Status Overview
          </CardTitle>
          <CardDescription>
            Current state of all reservations in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-sm bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Confirmed</h3>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/30">Active</Badge>
              </div>
              <p className="text-4xl text-green-600 mb-2">{confirmedReservations}</p>
              <p className="text-sm text-muted-foreground">Currently active bookings</p>
            </div>
            {/* Pending removed */}
            <div className="p-6 rounded-sm bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Cancelled</h3>
                <Badge className="bg-red-500/10 text-red-600 border-red-500/30">Inactive</Badge>
              </div>
              <p className="text-4xl text-red-600 mb-2">{cancelledReservations}</p>
              <p className="text-sm text-muted-foreground">Rejected or cancelled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings by Branch */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Active Bookings by Branch
          </CardTitle>
          <CardDescription>
            Number of confirmed reservations per location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '2px',
                    color: '#1a1a1a',
                  }}
                />
                <Legend />
                <Bar dataKey="bookings" fill="#1a1a1a" name="Active Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
