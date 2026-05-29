import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginForm>();

  async function onSubmit(vals: LoginForm) {
    setLoading(true);
    try {
      await signIn(vals.email, vals.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-surface-1 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-lg p-8 border border-surface-3">
          <h1 className="font-playfair text-3xl font-bold text-brand-dark text-center">Sign In</h1>
          <p className="font-dm text-sm text-brand-muted text-center mt-2">
            Welcome back to Localé
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-dm font-medium py-2.5 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center font-dm text-sm text-brand-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-orange hover:underline">Join free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
