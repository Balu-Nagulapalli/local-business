import { Link } from 'react-router-dom';
import { X, Search, Heart, User, Briefcase, Shield, LogOut } from 'lucide-react';
import type { User as UserType, ProfileRow } from '../../services/api';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  profile: ProfileRow | null;
  onSignOut: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function MobileMenu({ isOpen, onClose, user, profile, onSignOut, searchQuery, onSearchChange, onSearchSubmit }: MobileMenuProps) {
  if (!isOpen) return null;

  const role = profile?.role || 'user';

  return (
    <div className="fixed inset-0 z-[60] bg-brand-dark">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-white p-2">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={(e) => { onSearchSubmit(e); onClose(); }} className="px-6 mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search businesses..."
            className="w-full bg-white/10 text-white placeholder-white/40 text-base font-dm py-3 px-4 pr-10 rounded-lg border border-white/10 focus:outline-none focus:border-brand-orange/50"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        </div>
      </form>

      <nav className="px-6 space-y-1">
        {[
          { to: '/', label: 'Home' },
          { to: '/businesses', label: 'Browse All' },
          { to: '/category/restaurants', label: 'Restaurants' },
          { to: '/category/healthcare', label: 'Healthcare' },
          { to: '/category/education', label: 'Education' },
          { to: '/category/shopping', label: 'Shopping' },
          { to: '/category/fitness', label: 'Fitness' },
        ].map((link, i) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="block text-white/80 hover:text-white text-lg font-dm py-3 border-b border-white/5 animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
        {user ? (
          <div className="space-y-3">
            <p className="text-white font-dm font-medium">{profile?.name}</p>
            {role === 'user' && (
              <Link to="/dashboard/saved" onClick={onClose} className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-dm">
                <Heart className="w-4 h-4" /> Saved Businesses
              </Link>
            )}
            {role === 'owner' && (
              <Link to="/owner/listings" onClick={onClose} className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-dm">
                <Briefcase className="w-4 h-4" /> My Listings
              </Link>
            )}
            {role === 'admin' && (
              <Link to="/admin" onClick={onClose} className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-dm">
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
            <button
              onClick={() => { onSignOut(); onClose(); }}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-dm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" onClick={onClose} className="text-white/70 hover:text-white font-dm">Sign In</Link>
            <Link to="/register" onClick={onClose} className="bg-brand-orange text-white font-dm px-4 py-2 rounded text-sm">Join Free</Link>
          </div>
        )}
      </div>
    </div>
  );
}
