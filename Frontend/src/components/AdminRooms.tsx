import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Pencil, Trash2, Users, MapPin, ArrowLeft, Server } from 'lucide-react';
import type { Room } from '../App';
import { toast } from 'sonner@2.0.3';
import { formatPrice } from '../lib/pricing';

type AdminRoomsProps = {
  rooms: Room[];
  onAddRoom: (room: Omit<Room, 'id'>) => void;
  onEditRoom: (roomId: string, room: Partial<Room>) => void;
  onDeleteRoom: (roomId: string) => void;
  onBack: () => void;
};

export function AdminRooms({ rooms, onAddRoom, onEditRoom, onDeleteRoom, onBack }: AdminRoomsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formAmenities, setFormAmenities] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAvailable, setFormAvailable] = useState('true');
  // Optional per-hour pricing input (frontend only)
  const [formPricePerHour, setFormPricePerHour] = useState<string>('');

  const resetForm = () => {
    setFormName('');
    setFormLocation('');
    setFormCapacity('');
    setFormAmenities('');
    setFormImageUrl('');
    setFormAvailable('true');
    setFormPricePerHour('');
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const price = formPricePerHour.trim() === '' ? undefined : Math.max(0, Number(formPricePerHour));
    onAddRoom({
      name: formName,
      location: formLocation,
      capacity: parseInt(formCapacity),
      amenities: formAmenities.split(',').map((a) => a.trim()).filter(Boolean),
      imageUrl:
        formImageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      available: formAvailable === 'true',
      pricePerHour: isNaN(Number(price)) ? undefined : (price as number),
    });
    toast.success('Room added successfully', {
      description: `RMI server synchronized: ${formLocation}`,
    });
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      const price = formPricePerHour.trim() === '' ? undefined : Math.max(0, Number(formPricePerHour));
      onEditRoom(editingRoom.id, {
        name: formName,
        location: formLocation,
        capacity: parseInt(formCapacity),
        amenities: formAmenities.split(',').map((a) => a.trim()).filter(Boolean),
        imageUrl: formImageUrl,
        available: formAvailable === 'true',
        pricePerHour: isNaN(Number(price)) ? undefined : (price as number),
      });
      toast.success('Room updated successfully', {
        description: `Changes synchronized across all RMI servers`,
      });
      resetForm();
      setEditingRoom(null);
    }
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormName(room.name);
    setFormLocation(room.location);
    setFormCapacity(room.capacity.toString());
    setFormAmenities(room.amenities.join(', '));
    setFormImageUrl(room.imageUrl);
    setFormAvailable(room.available ? 'true' : 'false');
    setFormPricePerHour(typeof room.pricePerHour === 'number' ? String(room.pricePerHour) : '');
  };

  const handleDelete = (roomId: string, roomName: string) => {
    onDeleteRoom(roomId);
    toast.success('Room deleted successfully', {
      description: `${roomName} removed from all branch servers`,
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
        <h1 className="text-foreground mb-2">
          Room Management
        </h1>
        <p className="text-muted-foreground">Add, edit, or remove rooms from the distributed system</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">All Rooms</CardTitle>
              <CardDescription>
                {rooms.length} rooms across all branches
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-card border-border">
                <form onSubmit={handleAddRoom}>
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Room</DialogTitle>
                    <DialogDescription>
                      Create a new room. It will be synchronized across all RMI servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Room Name</Label>
                      <Input
                        id="name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g., Innovation Hub"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select value={formLocation} onValueChange={setFormLocation} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Agadir">Agadir</SelectItem>
                          <SelectItem value="Marrakech">Marrakech</SelectItem>
                          <SelectItem value="Casablanca">Casablanca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity (people)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formCapacity}
                        onChange={(e) => setFormCapacity(e.target.value)}
                        placeholder="e.g., 8"
                        min="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricePerHour">Price per hour (optional)</Label>
                      <Input
                        id="pricePerHour"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        value={formPricePerHour}
                        onChange={(e) => setFormPricePerHour(e.target.value)}
                        placeholder="e.g., 49.99"
                      />
                      <p className="text-xs text-muted-foreground">Leave empty if this room has no hourly pricing.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amenities">Equipment (comma-separated)</Label>
                      <Input
                        id="amenities"
                        value={formAmenities}
                        onChange={(e) => setFormAmenities(e.target.value)}
                        placeholder="e.g., Projector, Whiteboard, WiFi"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formAvailable} onValueChange={setFormAvailable} required>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="true">Available</SelectItem>
                          <SelectItem value="false">Reserved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL (optional)</Label>
                      <Input
                        id="imageUrl"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="p-3 bg-muted border border-border rounded-sm">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Server className="w-4 h-4" />
                        <span>Changes will be synchronized via RMI</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                    >
                      Add Room
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Room Name</TableHead>
                  <TableHead className="text-muted-foreground">Branch</TableHead>
                  <TableHead className="text-muted-foreground">Capacity</TableHead>
                  <TableHead className="text-muted-foreground">Price / hr</TableHead>
                  <TableHead className="text-muted-foreground">Equipment</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id} className="border-border">
                    <TableCell className="text-muted-foreground font-mono text-xs">{room.id}</TableCell>
                    <TableCell className="text-foreground">{room.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-foreground" />
                        <span className="text-foreground">{room.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-foreground" />
                        <span className="text-foreground">{room.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground text-sm">
                        {typeof room.pricePerHour === 'number' ? `${formatPrice(room.pricePerHour)} / hr` : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 2).map((amenity, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{room.amenities.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog
                          open={editingRoom?.id === room.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditingRoom(null);
                              resetForm();
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(room)}
                              className="border-border"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md bg-card border-border">
                            <form onSubmit={handleEditRoom}>
                              <DialogHeader>
                                <DialogTitle className="text-foreground">Edit Room</DialogTitle>
                                <DialogDescription>
                                  Update room details. Changes will sync across all servers.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Room Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-location">Location</Label>
                                  <Select value={formLocation} onValueChange={setFormLocation} required>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                      <SelectItem value="Agadir">Agadir</SelectItem>
                                      <SelectItem value="Marrakech">Marrakech</SelectItem>
                                      <SelectItem value="Casablanca">Casablanca</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-capacity">Capacity</Label>
                                  <Input
                                    id="edit-capacity"
                                    type="number"
                                    value={formCapacity}
                                    onChange={(e) => setFormCapacity(e.target.value)}
                                    min="1"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-pricePerHour">Price per hour (optional)</Label>
                                  <Input
                                    id="edit-pricePerHour"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    value={formPricePerHour}
                                    onChange={(e) => setFormPricePerHour(e.target.value)}
                                    placeholder="e.g., 49.99"
                                  />
                                  <p className="text-xs text-muted-foreground">Leave empty if this room has no hourly pricing.</p>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-amenities">
                                    Equipment (comma-separated)
                                  </Label>
                                  <Input
                                    id="edit-amenities"
                                    value={formAmenities}
                                    onChange={(e) => setFormAmenities(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select value={formAvailable} onValueChange={setFormAvailable} required>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                      <SelectItem value="true">Available</SelectItem>
                                      <SelectItem value="false">Reserved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-imageUrl">Image URL</Label>
                                  <Input
                                    id="edit-imageUrl"
                                    value={formImageUrl}
                                    onChange={(e) => setFormImageUrl(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="submit"
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="bg-red-500/20 text-red-600 border-red-500/30 hover:bg-red-500/30">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">Delete Room</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete <span className="font-medium text-foreground">{room.name}</span>?
                                This action cannot be undone and will affect all branch RMI servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-border">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(room.id, room.name)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete Room
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
