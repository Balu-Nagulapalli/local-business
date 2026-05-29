import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchAllUsers, adminUpdateUser } from '../../services/api';
import type { ProfileRow } from '../../services/api';
import DataTable from '../../components/admin/DataTable';

export default function ManageUsers() {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function toggleActive(id: string, isActive: boolean) {
    try {
      await adminUpdateUser(id, { is_active: !isActive });
      toast.success(!isActive ? 'User activated' : 'User deactivated');
      loadUsers();
    } catch { toast.error('Failed to update'); }
  }

  async function changeRole(id: string, role: string) {
    try {
      await adminUpdateUser(id, { role });
      toast.success(`Role changed to ${role}`);
      loadUsers();
    } catch { toast.error('Failed to change role'); }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (row: ProfileRow) => (
      <select
        value={row.role}
        onChange={e => changeRole(row.id, e.target.value)}
        className="text-xs font-mono bg-surface-2 border border-surface-3 rounded px-2 py-1"
        onClick={e => e.stopPropagation()}
      >
        <option value="user">user</option>
        <option value="owner">owner</option>
        <option value="admin">admin</option>
      </select>
    )},
    { key: 'is_active', label: 'Status', sortable: true, render: (row: ProfileRow) => (
      <span className={`font-mono text-xs ${row.is_active ? 'text-green-600' : 'text-red-600'}`}>
        {row.is_active ? 'active' : 'inactive'}
      </span>
    )},
  ];

  return (
    <div className="pt-16 pl-56 min-h-screen bg-surface-1">
      <div className="p-8">
        <h1 className="font-playfair text-3xl font-bold text-brand-dark mb-6">Manage Users</h1>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-3 rounded" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            actions={(row) => (
              <button
                onClick={() => toggleActive(row.id, row.is_active)}
                className={`text-xs font-dm hover:underline ${row.is_active ? 'text-red-600' : 'text-green-600'}`}
              >
                {row.is_active ? 'Deactivate' : 'Activate'}
              </button>
            )}
          />
        )}
      </div>
    </div>
  );
}
