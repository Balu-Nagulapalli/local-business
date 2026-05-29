import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'owner' ? 'owner' : 'user';
  const { register, handleSubmit, setValue } = useForm<RegisterForm>({
    defaultValues: { role: defaultRole },
  });

  async function onSubmit(vals: RegisterForm) {
    if (vals.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signUp(vals.email, vals.password, vals.name, vals.role);
      toast.success('Account created! Welcome to Localé');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-surface-1 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-lg p-8 border border-surface-3">
          <h1 className="font-playfair text-3xl font-bold text-brand-dark text-center">Join Localé</h1>
          <p className="font-dm text-sm text-brand-muted text-center mt-2">
            Find and review the best local businesses
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Full Name</label>
              <input
                {...register('name', { required: true })}
                className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Email</label>
              <input
                {...register('email', { required: true })}
                type="email"
                className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Password</label>
              <input
                {...register('password', { required: true })}
                type="password"
                className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">I am a...</label>
              <select
                {...register('role')}
                className="w-full mt-1 px-3 py-2.5 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
              >
                <option value="user">User — Looking for businesses</option>
                <option value="owner">Business Owner — Want to list my business</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-dm font-medium py-2.5 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center font-dm text-sm text-brand-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
