import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Building2,
  Users,
  Calendar,
  MapPin,
  Server,
  LayoutDashboard,
  DoorOpen,
  UserCog,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import type { Room, Reservation, AppUser, Page } from '../App';

type AdminPanelProps = {
  rooms: Room[];
  reservations: Reservation[];
  users: AppUser[];
  onNavigate: (page: Page) => void;
};

export function AdminPanel({ rooms, reservations, users, onNavigate }: AdminPanelProps) {
  const locations = ['Agadir', 'Marrakech', 'Casablanca'];
  const roomsByLocation = locations.map((location) => ({
    location,
    count: rooms.filter((r) => r.location === location).length,
    available: rooms.filter((r) => r.location === location && r.available).length,
    reservations: reservations.filter(
      (res) => res.location === location && res.status === 'confirmed'
    ).length,
  }));

  const pendingReservations = reservations.filter((r) => r.status === 'pending').length;
  const confirmedReservations = reservations.filter((r) => r.status === 'confirmed').length;

  return (
    <div className="flex min-h-screen relative z-10">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <h2 className="text-foreground mb-1">Admin Dashboard</h2>
          <p className="text-xs text-muted-foreground">System Management</p>
        </div>
        <nav className="space-y-1 px-3">
          <Button
            variant="ghost"
            className="w-full justify-start bg-muted text-foreground"
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-muted"
            onClick={() => onNavigate('admin-rooms')}
          >
            <DoorOpen className="w-4 h-4 mr-3" />
            Manage Rooms
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-muted"
            onClick={() => onNavigate('admin-users')}
          >
            <UserCog className="w-4 h-4 mr-3" />
            Manage Users
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-muted"
            onClick={() => onNavigate('admin-validate')}
          >
            <CheckCircle className="w-4 h-4 mr-3" />
            Validate Reservations
            {pendingReservations > 0 && (
              <Badge className="ml-auto bg-red-500/20 text-red-600 border-red-500/30">
                {pendingReservations}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-muted"
            onClick={() => onNavigate('admin-stats')}
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            Statistics
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-foreground mb-2">
              System Overview
            </h1>
            <p className="text-muted-foreground">Monitor and manage the distributed co-working space system</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardDescription>Total Rooms</CardDescription>
                <CardTitle className="text-3xl text-foreground">{rooms.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  Across {locations.length} branches
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
                  <Calendar className="w-4 h-4 text-green-600" />
                  Currently booked
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl text-foreground">{users.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {users.filter((u) => u.role === 'admin').length} admins
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardDescription>Pending Requests</CardDescription>
                <CardTitle className="text-3xl text-foreground">{pendingReservations}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  Awaiting approval
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Branch Overview */}
          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Branch Overview</CardTitle>
              <CardDescription>
                Room and reservation statistics by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roomsByLocation.map((branch) => (
                  <div
                    key={branch.location}
                    className="p-4 bg-muted border border-border rounded-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-foreground" />
                      <span className="text-foreground">{branch.location}</span>
                      <Badge className="ml-auto bg-green-500/10 text-green-600 border-green-500/30">
                        Online
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Rooms:</span>
                        <span className="text-foreground">{branch.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="text-green-600">{branch.available}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Bookings:</span>
                        <span className="text-foreground">{branch.reservations}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => onNavigate('admin-rooms')}
                  className="h-auto py-4 flex-col gap-2 bg-muted hover:bg-muted/80 border border-border text-foreground"
                  variant="outline"
                >
                  <DoorOpen className="w-6 h-6" />
                  <span>Add New Room</span>
                </Button>
                <Button
                  onClick={() => onNavigate('admin-users')}
                  className="h-auto py-4 flex-col gap-2 bg-muted hover:bg-muted/80 border border-border text-foreground"
                  variant="outline"
                >
                  <UserCog className="w-6 h-6" />
                  <span>Manage Users</span>
                </Button>
                <Button
                  onClick={() => onNavigate('admin-validate')}
                  className="h-auto py-4 flex-col gap-2 bg-muted hover:bg-muted/80 border border-border text-foreground"
                  variant="outline"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>Approve Requests</span>
                </Button>
                <Button
                  onClick={() => onNavigate('admin-stats')}
                  className="h-auto py-4 flex-col gap-2 bg-muted hover:bg-muted/80 border border-border text-foreground"
                  variant="outline"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
