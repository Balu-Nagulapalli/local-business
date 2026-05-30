import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import api, { fetchAllUsers, adminUpdateUser } from '../../services/api';
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

  async function toggleActive(user: any) {
    try {
      const userId = user._id || user.id;
      const isActive = user.isActive ?? user.is_active ?? true;
      await axios.put(
        `/api/users/${userId}`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(!isActive ? 'User activated' : 'User deactivated');
      loadUsers();
    } catch { toast.error('Failed to update'); }
  }

  async function changeRole(user: any, role: string) {
    try {
      await adminUpdateUser(user._id || user.id, { role });
      toast.success(`Role changed to ${role}`);
      loadUsers();
    } catch { toast.error('Failed to change role'); }
  }

  const handleDelete = async (user: any) => {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${user._id || user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(prev => prev.filter(u => 
        (u._id || u.id) !== (user._id || user.id)
      ));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (row: ProfileRow) => (
      <select
        value={row.role}
        onChange={e => changeRole(row, e.target.value)}
        className="text-xs font-mono bg-surface-2 border border-surface-3 rounded px-2 py-1"
        onClick={e => e.stopPropagation()}
      >
        <option value="user">user</option>
        <option value="owner">owner</option>
        <option value="admin">admin</option>
      </select>
    )},
    { key: 'is_active', label: 'Status', sortable: true, render: (row: ProfileRow) => (
      <span className={`font-mono text-xs ${(row.isActive ?? row.is_active ?? true) ? 'text-green-600' : 'text-red-500'}`}>
        {(row.isActive ?? row.is_active ?? true) ? 'active' : 'inactive'}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(row)}
                  className={`text-xs font-dm hover:underline ${row.is_active ? 'text-red-600' : 'text-green-600'}`}
                >
                  {row.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="text-red-500 hover:underline text-sm ml-2"
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
