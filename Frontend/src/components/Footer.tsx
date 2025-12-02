import { Network, Activity, Building2, Linkedin, Instagram, Twitter } from 'lucide-react';
import type { Page } from '../App';

type FooterProps = {
  onNavigate: (page: Page) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground tracking-tight">CoWorkingSpace</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Distributed co-working space reservation system across multiple branches in Morocco.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Room Availability
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-reservations')}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  My Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  My Profile
                </button>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h3 className="text-foreground mb-4">System Information</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('status')}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  System Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('architecture')}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2"
                >
                  <Network className="w-4 h-4" />
                  Architecture
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 CoWorkingSpace. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
