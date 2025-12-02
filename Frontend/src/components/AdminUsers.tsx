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
import { ArrowLeft, UserPlus, ShieldCheck, Trash2, Mail, Calendar as CalendarIcon } from 'lucide-react';
import type { AppUser } from '../App';
import { toast } from 'sonner@2.0.3';

type AdminUsersProps = {
  users: AppUser[];
  onUpdateUser: (userId: string, updates: Partial<AppUser>) => void;
  onDeleteUser: (userId: string) => void;
  onBack: () => void;
};

export function AdminUsers({ users, onUpdateUser, onDeleteUser, onBack }: AdminUsersProps) {
  const handlePromote = (userId: string, userName: string) => {
    onUpdateUser(userId, { role: 'admin' });
    toast.success('User promoted to admin', {
      description: `${userName} now has administrator privileges`,
    });
  };

  const handleDemote = (userId: string, userName: string) => {
    onUpdateUser(userId, { role: 'user' });
    toast.success('Admin demoted to user', {
      description: `${userName} admin privileges removed`,
    });
  };

  const handleDelete = (userId: string, userName: string) => {
    onDeleteUser(userId);
    toast.success('User removed', {
      description: `${userName} has been deleted from the system`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

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
          User Management
        </h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl text-foreground">{users.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserPlus className="w-4 h-4" />
              All registered accounts
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Administrators</CardDescription>
            <CardTitle className="text-3xl text-foreground">{adminCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              Privileged accounts
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Regular Users</CardDescription>
            <CardTitle className="text-3xl text-foreground">{userCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserPlus className="w-4 h-4" />
              Standard accounts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Users</CardTitle>
          <CardDescription>
            View and manage user roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Registered</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell className="text-muted-foreground font-mono text-xs">{user.id}</TableCell>
                    <TableCell className="text-foreground">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground text-sm">{user.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? (
                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30" variant="outline">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Administrator
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-foreground border-border" variant="outline">
                          <UserPlus className="w-3 h-3 mr-1" />
                          User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <CalendarIcon className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.role === 'user' ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border"
                              >
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Promote
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Promote to Admin</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to promote <span className="font-medium text-foreground">{user.name}</span> to administrator?
                                  They will have full access to the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-border">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handlePromote(user.id, user.name)}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                  Promote User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border"
                              >
                                Demote
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Demote Admin</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to demote <span className="font-medium text-foreground">{user.name}</span> to regular user?
                                  They will lose administrator privileges.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-border">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDemote(user.id, user.name)}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                  Demote User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500/20 text-red-600 border-red-500/30 hover:bg-red-500/30"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">Remove User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete <span className="font-medium text-foreground">{user.name}</span>?
                                This action cannot be undone and all their reservations will be cancelled.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-border">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.id, user.name)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
