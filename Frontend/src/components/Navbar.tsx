import { Button } from './ui/button';
import { Building2, Calendar, LayoutDashboard, LogOut, Shield, User as UserIcon, Moon, Sun } from 'lucide-react';
import type { User } from '../App';
import type { Page } from '../App';

import { useTheme } from "../theme/ThemeContext";

type NavbarProps = {
  user: User | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
};

export function Navbar({ user, currentPage, onNavigate, onLogout }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <span className="text-foreground tracking-tight">CoWorkingSpace</span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onNavigate('dashboard')}
                className={currentPage === 'dashboard' ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-0' : 'text-foreground hover:text-foreground/70'}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentPage === 'my-reservations' ? 'default' : 'ghost'}
                onClick={() => onNavigate('my-reservations')}
                className={currentPage === 'my-reservations' ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-0' : 'text-foreground hover:text-foreground/70'}
              >
                <Calendar className="w-4 h-4 mr-2" />
                My Reservations
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant={currentPage.startsWith('admin') ? 'default' : 'ghost'}
                  onClick={() => onNavigate('admin')}
                  className={currentPage.startsWith('admin') ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-0' : 'text-foreground hover:text-foreground/70'}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              aria-pressed={theme === 'darkBlue'}
              title={theme === 'darkBlue' ? 'Switch to Light Mode' : 'Switch to Dark Blue Mode'}
              className="text-foreground hover:text-foreground/70"
            >
              {theme === 'darkBlue' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onNavigate('profile')}
              className="text-foreground hover:text-foreground/70"
            >
              <UserIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{user?.name}</span>
            </Button>
            <Button variant="outline" onClick={onLogout} className="border-border text-foreground hover:bg-muted">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
