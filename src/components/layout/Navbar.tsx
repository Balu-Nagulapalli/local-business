import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Menu, X, LogOut, User, Shield, Briefcase, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import MobileMenu from './MobileMenu';

const CITIES = ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Bangalore', 'Chennai', 'Pune'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const isHome = location.pathname === '/';

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const cityRef = useOutsideClick(() => setCityDropdown(false));
  const userRef = useOutsideClick(() => setUserDropdown(false));

  const navBg = isHome
    ? scrolled
      ? 'bg-brand-dark/95 backdrop-blur-md'
      : 'bg-transparent'
    : 'bg-brand-dark';

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  const role = profile?.role || 'user';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: wordmark + city selector */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <span className="font-playfair italic text-2xl text-white tracking-tight">
                  Localé
                </span>
              </Link>
              <span className="text-white/30 text-lg select-none">·</span>
              <div ref={cityRef} className="relative">
                <button
                  onClick={() => setCityDropdown(!cityDropdown)}
                  className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-dm transition-colors"
                >
                  {selectedCity}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {cityDropdown && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg py-1 min-w-[160px] animate-slide-up">
                    {CITIES.map(c => (
                      <button
                        key={c}
                        onClick={() => { setSelectedCity(c); setCityDropdown(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm font-dm hover:bg-surface-2 transition-colors ${
                          c === selectedCity ? 'text-brand-orange font-medium' : 'text-txt-primary'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center: search (desktop) */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="search-underline relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full bg-transparent text-white placeholder-white/40 text-sm font-dm py-2 pr-8 border-b border-white/10 focus:outline-none"
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              </div>
            </form>

            {/* Right: nav links + auth */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/businesses" className="text-white/70 hover:text-white text-sm font-dm transition-colors">
                Browse
              </Link>
              <Link to="/category/restaurants" className="text-white/70 hover:text-white text-sm font-dm transition-colors">
                Categories
              </Link>

              {user ? (
                <div ref={userRef} className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: '#E8470A' }}
                    >
                      {profile?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </button>
                  {userDropdown && (
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg py-2 min-w-[180px] animate-slide-up">
                      <div className="px-4 py-2 border-b border-surface-3">
                        <p className="text-sm font-dm font-medium text-txt-primary">{profile?.name}</p>
                        <p className="text-xs font-mono text-brand-muted">{role}</p>
                      </div>
                      {role === 'user' && (
                        <>
                          <Link to="/dashboard/saved" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-dm text-txt-primary hover:bg-surface-2">
                            <Heart className="w-4 h-4" /> Saved
                          </Link>
                          <Link to="/dashboard/reviews" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-dm text-txt-primary hover:bg-surface-2">
                            <User className="w-4 h-4" /> My Reviews
                          </Link>
                          <Link to="/dashboard/profile" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-dm text-txt-primary hover:bg-surface-2">
                            <User className="w-4 h-4" /> Profile
                          </Link>
                        </>
                      )}
                      {role === 'owner' && (
                        <Link to="/owner/listings" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-dm text-txt-primary hover:bg-surface-2">
                          <Briefcase className="w-4 h-4" /> My Listings
                        </Link>
                      )}
                      {role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-dm text-txt-primary hover:bg-surface-2">
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-surface-3 mt-1 pt-1">
                        <button
                          onClick={() => { signOut(); setUserDropdown(false); }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-dm text-red-600 hover:bg-surface-2"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-white/70 hover:text-white text-sm font-dm transition-colors">
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-dm font-medium px-4 py-1.5 rounded transition-colors"
                  >
                    Join Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-white p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        profile={profile}
        onSignOut={signOut}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />
    </>
  );
}
