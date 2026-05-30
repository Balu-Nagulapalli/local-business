import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api, { fetchAllBusinesses, adminUpdateBusiness } from '../../services/api';
import type { BusinessRow } from '../../services/api';
import DataTable from '../../components/admin/DataTable';

export default function ManageBusinesses() {
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBusinesses(); }, [loadBusinesses]);

  async function handleApprove(business: any) {
    try {
      await adminUpdateBusiness(business._id || business.id, {
        isApproved: true,
        status: 'active',
      });
      toast.success('Business approved');
      loadBusinesses();
    } catch { toast.error('Failed to approve'); }
  }

  async function handleReject(business: any) {
    try {
      await adminUpdateBusiness(business._id || business.id, {
        isApproved: false,
        status: 'rejected',
      });
      toast.success('Business rejected');
      loadBusinesses();
    } catch { toast.error('Failed to reject'); }
  }

  async function handleFeature(business: any) {
    try {
      await adminUpdateBusiness(business._id || business.id, {
        isFeatured: !business.isFeatured,
      });
      toast.success(!business.isFeatured ? 'Featured' : 'Unfeatured');
      loadBusinesses();
    } catch { toast.error('Failed to update'); }
  }

  const handleDelete = async (business: any) => {
    if (!confirm(`Delete "${business.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/businesses/${business._id || business.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBusinesses(prev => prev.filter(b => 
        (b._id || b.id) !== (business._id || business.id)
      ));
      toast.success('Business deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (row: BusinessRow) => (
      <span className={row.is_verified ? 'verified-name' : ''}>{row.name}</span>
    )},
    { key: 'status', label: 'Status', sortable: true, render: (row: BusinessRow) => {
      const colors: Record<string, string> = { active: 'text-green-600', pending: 'text-yellow-600', rejected: 'text-red-600' };
      return <span className={`font-mono text-xs ${colors[row.status] || ''}`}>{row.status}</span>;
    }},
    { key: 'avg_rating', label: 'Rating', sortable: true, render: (row: BusinessRow) => (
      <span className="font-mono text-xs">{row.avg_rating > 0 ? row.avg_rating.toFixed(1) : '–'}</span>
    )},
    { key: 'total_reviews', label: 'Reviews', sortable: true, render: (row: BusinessRow) => (
      <span className="font-mono text-xs">{row.total_reviews}</span>
    )},
  ];

  return (
    <div className="pt-16 pl-56 min-h-screen bg-surface-1">
      <div className="p-8">
        <h1 className="font-playfair text-3xl font-bold text-brand-dark mb-6">Manage Businesses</h1>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-3 rounded" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={businesses}
            actions={(row) => (
              <div className="flex items-center gap-3">
                {row.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(row)} className="text-xs font-dm text-green-600 hover:underline">Approve</button>
                    <button onClick={() => handleReject(row)} className="text-xs font-dm text-red-600 hover:underline">Reject</button>
                  </>
                )}
                <button onClick={() => handleFeature(row)} className="text-xs font-dm text-brand-orange hover:underline">
                  {row.isFeatured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
