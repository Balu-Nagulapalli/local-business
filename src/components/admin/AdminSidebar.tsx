import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, MessageSquare, Tags } from 'lucide-react';

const LINKS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/businesses', icon: Building2, label: 'Businesses' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
  { to: '/admin/categories', icon: Tags, label: 'Categories' },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-brand-dark overflow-y-auto">
      <nav className="py-6 space-y-1">
        {LINKS.map(link => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-dm transition-colors border-l-2 ${
                active
                  ? 'border-brand-orange text-white bg-white/5'
                  : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
