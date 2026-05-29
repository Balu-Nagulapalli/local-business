import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { updateProfile, fetchProfile } from '../../services/api';
import type { ProfileRow } from '../../services/api';
import { User } from 'lucide-react';

interface ProfileForm {
  name: string;
  avatar: string;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm<ProfileForm>();

  useEffect(() => {
    fetchProfile().then(p => {
      setProfile(p);
      if (p) reset({ name: p.name, avatar: p.avatar });
    });
  }, [reset]);

  async function onSubmit(vals: ProfileForm) {
    setSaving(true);
    try {
      await updateProfile({ name: vals.name, avatar: vals.avatar });
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-brand-orange" />
          <h1 className="font-playfair text-3xl font-bold text-brand-dark">Profile Settings</h1>
        </div>

        {profile && (
          <div className="bg-white rounded-lg p-6 border border-surface-3">
            <div className="mb-4">
              <span className="text-xs font-mono text-brand-muted uppercase tracking-wider">Role</span>
              <p className="font-dm text-sm text-txt-primary capitalize mt-1">{profile.role}</p>
            </div>
            <div className="mb-4">
              <span className="text-xs font-mono text-brand-muted uppercase tracking-wider">Email</span>
              <p className="font-dm text-sm text-txt-primary mt-1">{profile.email}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6 border-t border-surface-3 pt-6">
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Name</label>
                <input
                  {...register('name', { required: true })}
                  className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Avatar URL</label>
                <input
                  {...register('avatar')}
                  className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
                  placeholder="https://..."
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-dm font-medium px-6 py-2.5 rounded text-sm transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
