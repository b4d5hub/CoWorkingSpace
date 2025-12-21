import { useEffect, useState } from "react";
import { Homepage } from "./components/Homepage";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { ReservationForm } from "./components/ReservationForm";
import { MyReservations } from "./components/MyReservations";
import { AdminPanel } from "./components/AdminPanel";
import { AdminRooms } from "./components/AdminRooms";
import { AdminUsers } from "./components/AdminUsers";
import { AdminValidate } from "./components/AdminValidate";
import { AdminStats } from "./components/AdminStats";
import { SystemArchitecture } from "./components/SystemArchitecture";
import { ProfilePage } from "./components/ProfilePage";
import { SystemStatus } from "./components/SystemStatus";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { toast } from 'sonner@2.0.3';

export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "user" | "admin";
};

export type Room = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  available: boolean;
  pricePerHour?: number;
};

export type Reservation = {
  id: string;
  userId: string;
  userName: string;
  roomId: string;
  roomName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | "pending";
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
};

export type Page =
  | "home"
  | "login"
  | "dashboard"
  | "reservation"
  | "my-reservations"
  | "admin"
  | "admin-rooms"
  | "admin-users"
  | "admin-validate"
  | "admin-stats"
  | "architecture"
  | "profile"
  | "status";

// --- Lightweight History Router helpers (clean URLs, no #) ---
function pathToPage(pathname: string): Page {
  const p = (pathname || "/").replace(/\/+$/, ""); // trim trailing slash except for root
  if (p === "") return "home";
  switch (p) {
    case "/": return "home";
    case "/login": return "login";
    case "/dashboard": return "dashboard";
    case "/reservation": return "reservation";
    case "/my-reservations": return "my-reservations";
    case "/admin": return "admin";
    case "/admin/rooms": return "admin-rooms";
    case "/admin/users": return "admin-users";
    case "/admin/validate": return "admin-validate";
    case "/admin/stats": return "admin-stats";
    case "/architecture": return "architecture";
    case "/profile": return "profile";
    case "/status": return "status";
    default: return "home";
  }
}

function pageToPath(p: Page): string {
  switch (p) {
    case "home": return "/";
    case "login": return "/login";
    case "dashboard": return "/dashboard";
    case "reservation": return "/reservation";
    case "my-reservations": return "/my-reservations";
    case "admin": return "/admin";
    case "admin-rooms": return "/admin/rooms";
    case "admin-users": return "/admin/users";
    case "admin-validate": return "/admin/validate";
    case "admin-stats": return "/admin/stats";
    case "architecture": return "/architecture";
    case "profile": return "/profile";
    case "status": return "/status";
    default: return "/";
  }
}

export default function App() {
  // Initialize page from current URL path (history router)
  const [currentPage, setCurrentPage] = useState<Page>(() => pathToPage(window.location.pathname));
  // Restore logged-in user from localStorage (persist session across refresh)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    null,
  );
  const [initialLocationFilter, setInitialLocationFilter] = useState<string>('all');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Sync URL path with currentPage, and listen to back/forward
  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(pathToPage(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const expected = pageToPath(currentPage);
    if (window.location.pathname !== expected) {
      window.history.pushState(null, "", expected);
    }
  }, [currentPage]);

  // Persist currentUser to localStorage on change
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
      else localStorage.removeItem('currentUser');
    } catch {}
  }, [currentUser]);

  // Load rooms from backend REST (DB-backed via RMI)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { listRooms } = await import('./api/rooms');
        const data = await listRooms();
        if (!cancelled) setRooms(data);
      } catch (e) {
        console.error('Failed to load rooms', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Helpers to load data on demand
  const loadUsers = async () => {
    try {
      const { listUsers } = await import('./api/users');
      const u = await listUsers();
      setUsers(u);
    } catch (e) {
      console.error('Failed to load users', e);
    }
  };

  const loadUserReservations = async () => {
    if (!currentUser) return;
    try {
      const { listReservations } = await import('./api/reservations');
      const r = await listReservations({ client: currentUser.email });
      setReservations(r);
    } catch (e) {
      console.error('Failed to load reservations', e);
    }
  };

  const loadAllReservations = async () => {
    try {
      const { listReservations } = await import('./api/reservations');
      const r = await listReservations();
      setReservations(r);
    } catch (e) {
      console.error('Failed to load all reservations', e);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("home");
    setSelectedRoom(null);
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentPage("reservation");
  };

  const handleConfirmReservation = async (
    reservation: Omit<Reservation, "id">
  ) => {
    try {
      const { createReservation } = await import('./api/reservations');
      await createReservation({
        salleId: reservation.roomId,
        client: currentUser?.email || reservation.userName,
        date: reservation.date,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
      });
      await loadUserReservations();
      setCurrentPage("my-reservations");
      setSelectedRoom(null);
    } catch (e) {
      console.error('Failed to create reservation', e);
      // Normalize message and show a toast (covers 409 overlap case)
      const msg = (e as any)?.message ? String((e as any).message) : 'Reservation failed';
      const isConflict = /not available|overlap|409/i.test(msg);
      if (isConflict) {
        toast.error('Room not available for the selected time', {
          description: 'Pick a different time window or another room.',
        });
      } else {
        toast.error('Reservation failed', { description: msg });
      }
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const { cancelReservation } = await import('./api/reservations');
      await cancelReservation(reservationId);
      // Refresh list depending on user role/page
      if (currentUser?.role === 'admin') await loadAllReservations();
      else await loadUserReservations();
    } catch (e) {
      console.error('Failed to cancel reservation', e);
    }
  };

  const handleAddRoom = async (room: Omit<Room, "id">) => {
    try {
      const { createRoom } = await import('./api/rooms');
      const created = await createRoom(room);
      setRooms((prev) => [created, ...prev]);
    } catch (e) {
      console.error('Failed to add room', e);
    }
  };

  const handleEditRoom = async (
    roomId: string,
    updatedRoom: Partial<Room>,
  ) => {
    try {
      const { updateRoom } = await import('./api/rooms');
      const updated = await updateRoom(roomId, updatedRoom);
      setRooms((prev) => prev.map((r) => (r.id === roomId ? updated : r)));
    } catch (e) {
      console.error('Failed to update room', e);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const { deleteRoom } = await import('./api/rooms');
      await deleteRoom(roomId);
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch (e) {
      console.error('Failed to delete room', e);
    }
  };

  const handleUpdateUser = async (
    userId: string,
    updates: Partial<AppUser>,
  ) => {
    try {
      const { updateUser } = await import('./api/users');
      const updated = await updateUser(userId, updates);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...currentUser, ...updated });
      }
    } catch (e) {
      console.error('Failed to update user', e);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { deleteUser } = await import('./api/users');
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (e) {
      console.error('Failed to delete user', e);
    }
  };

  const handleApproveReservation = async (reservationId: string) => {
    try {
      const { approveReservation } = await import('./api/reservations');
      await approveReservation(reservationId);
      await loadAllReservations();
    } catch (e) {
      console.error('Failed to approve reservation', e);
    }
  };

  const handleRejectReservation = async (reservationId: string) => {
    try {
      const { rejectReservation } = await import('./api/reservations');
      await rejectReservation(reservationId);
      await loadAllReservations();
    } catch (e) {
      console.error('Failed to reject reservation', e);
    }
  };

  const handleNavigateToLocation = (location: string) => {
    setInitialLocationFilter(location);
    setCurrentPage("login");
  };

  // Fetch required data when page changes
  useEffect(() => {
    if (currentPage === 'my-reservations' && currentUser) {
      loadUserReservations();
    }
    if ((currentPage === 'admin' || currentPage === 'admin-validate' || currentPage === 'admin-stats')) {
      loadAllReservations();
    }
    if ((currentPage === 'admin' || currentPage === 'admin-users' || currentPage === 'admin-stats')) {
      loadUsers();
    }
  }, [currentPage]);

  if (currentPage === "home") {
    return (
      <>
        <Homepage 
          isLoggedIn={!!currentUser}
          onGetStarted={() => setCurrentUser ? setCurrentPage(currentUser ? "dashboard" : "login") : setCurrentPage("login")} 
          onNavigateToLocation={handleNavigateToLocation}
        />
        <Footer onNavigate={setCurrentPage} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "login") {
    return (
      <>
        <LoginPage 
          onLogin={handleLogin}
          onBackToHome={() => setCurrentPage("home")}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Toaster />
      <Navbar
        user={currentUser}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="relative">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        {currentPage === "dashboard" && (
          <Dashboard
            rooms={rooms}
            reservations={reservations}
            onSelectRoom={handleSelectRoom}
            initialLocation={initialLocationFilter}
          />
        )}
        {currentPage === "reservation" &&
          selectedRoom &&
          currentUser && (
            <ReservationForm
              room={selectedRoom}
              user={currentUser}
              onConfirm={handleConfirmReservation}
              onCancel={() => setCurrentPage("dashboard")}
            />
          )}
        {currentPage === "my-reservations" && currentUser && (
          <MyReservations
            // The reservations state is already scoped to the current user via loadUserReservations()
            reservations={reservations}
            rooms={rooms}
            onCancel={handleCancelReservation}
          />
        )}
        {currentPage === "admin" &&
          currentUser?.role === "admin" && (
            <AdminPanel
              rooms={rooms}
              reservations={reservations}
              users={users}
              onNavigate={setCurrentPage}
            />
          )}
        {currentPage === "admin-rooms" &&
          currentUser?.role === "admin" && (
            <AdminRooms
              rooms={rooms}
              onAddRoom={handleAddRoom}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
              onBack={() => setCurrentPage("admin")}
            />
          )}
        {currentPage === "admin-users" &&
          currentUser?.role === "admin" && (
            <AdminUsers
              users={users}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onBack={() => setCurrentPage("admin")}
            />
          )}
        {currentPage === "admin-validate" &&
          currentUser?.role === "admin" && (
            <AdminValidate
              reservations={reservations}
              onApprove={handleApproveReservation}
              onReject={handleRejectReservation}
              onCancel={handleCancelReservation}
              onBack={() => setCurrentPage("admin")}
            />
          )}
        {currentPage === "admin-stats" &&
          currentUser?.role === "admin" && (
            <AdminStats
              rooms={rooms}
              reservations={reservations}
              users={users}
              onBack={() => setCurrentPage("admin")}
            />
          )}
        {currentPage === "architecture" && (
          <SystemArchitecture
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
        {currentPage === "profile" && currentUser && (
          <ProfilePage
            user={currentUser}
            onBack={() => setCurrentPage("dashboard")}
            onUpdateProfile={handleUpdateUser}
          />
        )}
        {currentPage === "status" && (
          <SystemStatus
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}