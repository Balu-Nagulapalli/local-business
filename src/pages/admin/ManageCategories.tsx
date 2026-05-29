import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../services/api';
import type { CategoryRow } from '../../services/api';
import DataTable from '../../components/admin/DataTable';

export default function ManageCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', render: (row: CategoryRow) => (
      <span className="font-mono text-xs text-brand-muted">{row.slug}</span>
    )},
    { key: 'business_count', label: 'Businesses', sortable: true, render: (row: CategoryRow) => (
      <span className="font-mono text-xs">{row.business_count}</span>
    )},
    { key: 'is_active', label: 'Active', render: (row: CategoryRow) => (
      <span className={`font-mono text-xs ${row.is_active ? 'text-green-600' : 'text-red-600'}`}>
        {row.is_active ? 'yes' : 'no'}
      </span>
    )},
  ];

  return (
    <div className="pt-16 pl-56 min-h-screen bg-surface-1">
      <div className="p-8">
        <h1 className="font-playfair text-3xl font-bold text-brand-dark mb-6">Manage Categories</h1>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-3 rounded" />
            ))}
          </div>
        ) : (
          <DataTable columns={columns} data={categories} />
        )}
      </div>
    </div>
  );
}
