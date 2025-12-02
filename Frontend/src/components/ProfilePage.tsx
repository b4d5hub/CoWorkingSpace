import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { COUNTRY_CODES } from '../lib/countryCodes';
import { Badge } from './ui/badge';
import { ArrowLeft, User, Mail, Shield, Calendar, Clock, MapPin, Edit2, Save, X, Phone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User as UserType, AppUser } from '../App';

type ProfilePageProps = {
  user: UserType;
  onBack: () => void;
  onUpdateProfile: (userId: string, updates: Partial<AppUser>) => void;
};

export function ProfilePage({ user, onBack, onUpdateProfile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  // Phone composed of country code + local number, same as Register form
  const initialCode = (() => {
    const p = user.phone?.trim() || '';
    const token = p.split(/\s+/)[0] || '+212';
    return token.startsWith('+') ? token : '+212';
  })();
  const initialLocal = (() => {
    const p = user.phone?.trim() || '';
    const parts = p.split(/\s+/);
    if (parts.length > 1) {
      return parts.slice(1).join(' ');
    }
    return '';
  })();
  const [editedCountryCode, setEditedCountryCode] = useState<string>(initialCode);
  const [editedPhoneLocal, setEditedPhoneLocal] = useState<string>(initialLocal);

  const handleSave = () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!editedEmail.trim() || !editedEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone required
    const localTrimmed = editedPhoneLocal.trim();
    if (!localTrimmed) {
      toast.error('Phone number is required');
      return;
    }

    const combinedPhone = `${editedCountryCode} ${localTrimmed}`;

    onUpdateProfile(user.id, {
      name: editedName,
      email: editedEmail,
      phone: combinedPhone,
    });

    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setEditedEmail(user.email);
    // Reset phone from current user.phone
    const p = user.phone?.trim() || '';
    const token = p.split(/\s+/)[0] || '+212';
    const code = token.startsWith('+') ? token : '+212';
    const local = (() => {
      const parts = p.split(/\s+/);
      return parts.length > 1 ? parts.slice(1).join(' ') : '';
    })();
    setEditedCountryCode(code);
    setEditedPhoneLocal(local);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="text-foreground hover:text-foreground/70">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground">View and manage your account information</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-border"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card className="bg-card border-border mb-6">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-sm bg-muted flex items-center justify-center border border-border">
              <User className="w-10 h-10 text-foreground" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-xl"
                    placeholder="Your name"
                  />
                </div>
              ) : (
                <CardTitle className="text-foreground text-2xl mb-2">{user.name}</CardTitle>
              )}
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30" variant="outline">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                ) : (
                  <Badge className="bg-muted text-foreground border-border" variant="outline">
                    <User className="w-3 h-3 mr-1" />
                    User
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-sm bg-muted">
              <div className="w-10 h-10 rounded-sm bg-background flex items-center justify-center border border-border">
                <Mail className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="h-8"
                    placeholder="your@email.com"
                  />
                ) : (
                  <p className="text-foreground">{user.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-sm bg-muted">
              <div className="w-10 h-10 rounded-sm bg-background flex items-center justify-center border border-border">
                <Phone className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <div className="flex gap-2 items-center">
                      <div className="min-w-[180px]">
                        <Select value={editedCountryCode} onValueChange={setEditedCountryCode}>
                          <SelectTrigger aria-label="Country code">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            side="bottom"
                            sideOffset={6}
                            className="bg-white z-50 w-[300px] shadow-lg border border-stone-200"
                            style={{ maxHeight: '320px' }}
                          >
                            <div className="max-h-[320px] overflow-y-auto">
                              {COUNTRY_CODES.map((c) => (
                                <SelectItem key={`${c.iso2}-${c.code}`} value={c.code}>
                                  {c.code} ({c.country})
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        id="profile-phone"
                        type="tel"
                        placeholder="Phone number"
                        value={editedPhoneLocal}
                        onChange={(e) => setEditedPhoneLocal(e.target.value)}
                        className="h-8 border-stone-200"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground">{user.phone || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-sm bg-muted">
              <div className="w-10 h-10 rounded-sm bg-background flex items-center justify-center border border-border">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Account Type</p>
                <p className="text-foreground capitalize">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-sm bg-muted">
              <div className="w-10 h-10 rounded-sm bg-background flex items-center justify-center border border-border">
                <User className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">User ID</p>
                <p className="text-foreground font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Account Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Member Since</span>
                <span className="text-foreground">November 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Last Login</span>
                <span className="text-foreground">Today</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Account Status</span>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/30">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Access Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Permissions</span>
                <span className="text-foreground">{user.role === 'admin' ? 'Full Access' : 'Standard'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Branch Access</span>
                <span className="text-foreground">All Locations</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">RMI Connection</span>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-1.5 animate-pulse"></span>
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info for Admins */}
      {user.role === 'admin' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Administrator Privileges
            </CardTitle>
            <CardDescription>
              Special permissions granted to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-sm bg-muted border border-border">
                <div className="w-8 h-8 rounded-sm bg-background flex items-center justify-center flex-shrink-0 mt-0.5 border border-border">
                  <MapPin className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-foreground text-sm mb-1">Room Management</p>
                  <p className="text-xs text-muted-foreground">Add, edit, and delete rooms across all branches</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-sm bg-muted border border-border">
                <div className="w-8 h-8 rounded-sm bg-background flex items-center justify-center flex-shrink-0 mt-0.5 border border-border">
                  <User className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-foreground text-sm mb-1">User Management</p>
                  <p className="text-xs text-muted-foreground">Manage user accounts and permissions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-sm bg-muted border border-border">
                <div className="w-8 h-8 rounded-sm bg-background flex items-center justify-center flex-shrink-0 mt-0.5 border border-border">
                  <Calendar className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-foreground text-sm mb-1">Reservation Control</p>
                  <p className="text-xs text-muted-foreground">Approve or reject reservation requests</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-sm bg-muted border border-border">
                <div className="w-8 h-8 rounded-sm bg-background flex items-center justify-center flex-shrink-0 mt-0.5 border border-border">
                  <Shield className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-foreground text-sm mb-1">System Access</p>
                  <p className="text-xs text-muted-foreground">Full access to system configuration and logs</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
