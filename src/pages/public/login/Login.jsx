import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Make sure this path matches your folder structure
import ForgotPassword from './ForgotPassword';

const Login = () => {
  // Use camelCase for setters (setEmail, setPassword)
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      // Now result.user actually exists!
      const userRole = result.user?.role;

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/events'); 
      }
    } else {
      // If it fails, show the error we passed back
      setError(result.error || 'Login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900">
      <div className="flex w-full flex-col justify-center px-8 relative">
        
        <button type='button' onClick={()=>{navigate('/')}} className="group absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Please enter your details to sign in.
            </p>
          </div>

        
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {/* ADDED onSubmit to the form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                Email
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                  Password
                </label>
                < Link to="/forgotpassword"  className="text-sm font-semibold text-orange-600 hover:text-orange-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                  placeholder="••••••••"
                  value={password}    
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Changed type="button" to type="submit" */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full items-center justify-center rounded-lg py-3 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] ${
                isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-orange-500 shadow-orange-500/20 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30'
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Or continue with</span>
              </div>
            </div>
          
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to='/register' className="font-bold text-orange-600 hover:text-orange-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;