import { useEffect, useState } from 'react';
import { fetchAdminStats } from '../../services/api';
import StatsCard from '../../components/admin/StatsCard';

export default function AdminOverview() {
  const [stats, setStats] = useState({ totalBusinesses: 0, totalUsers: 0, totalReviews: 0, pendingBusinesses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-20 pl-56 min-h-screen bg-surface-1">
        <div className="p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-surface-3 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pl-56 min-h-screen bg-surface-1">
      <div className="p-8">
        <h1 className="font-playfair text-3xl font-bold text-brand-dark mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Businesses" value={stats.totalBusinesses} accent="#E8470A" />
          <StatsCard label="Total Users" value={stats.totalUsers} accent="#3B82F6" />
          <StatsCard label="Total Reviews" value={stats.totalReviews} accent="#22C55E" />
          <StatsCard label="Pending Approval" value={stats.pendingBusinesses} accent="#EAB308" />
        </div>

        {/* quick actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-surface-3 rounded-lg p-5">
            <h3 className="font-playfair text-lg font-semibold text-brand-dark">Pending Businesses</h3>
            <p className="font-dm text-sm text-brand-muted mt-1">
              {stats.pendingBusinesses} business{stats.pendingBusinesses !== 1 ? 'es' : ''} waiting for approval
            </p>
          </div>
          <div className="bg-white border border-surface-3 rounded-lg p-5">
            <h3 className="font-playfair text-lg font-semibold text-brand-dark">Platform Health</h3>
            <p className="font-dm text-sm text-brand-muted mt-1">
              {stats.totalReviews} reviews across {stats.totalBusinesses} businesses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
