import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext'; // Verify this path matches your folder structure

const RegisterPage = () => {
  // 1. Setup State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Setup Hooks
  const { register } = useAuth();
  const navigate = useNavigate();

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh
    setError('');
    setIsSubmitting(true);

    // Call the backend API through your AuthContext
    const result = await register(name, email, password, 'user');

    if (result.success) {
      // If MongoDB saves the user, send them to the login page
      navigate('/login');
    } else {
      // If MongoDB rejects it (e.g., email taken), show the error
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-6">
      <button type='button' onClick={()=>{navigate('/')}} className="group absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create an account</h1>
          <p className="text-sm text-slate-500">Start your journey with Eventtalk today.</p>
        </div>

        {/* Dynamic Error Box */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* ADDED onSubmit to the form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                required
                placeholder="Kris Kalariya" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="email" 
                required
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="password" 
                required
                minLength="6"
                placeholder="Create a strong password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all" 
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">Must be at least 6 characters long.</p>
          </div>

          {/* Changed type to submit and added loading state */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full rounded-lg px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all mt-4 ${
              isSubmitting 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-[#F95A00] hover:bg-orange-600 active:scale-95'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          Already have an account? <Link to="/login" className="font-bold text-[#F95A00] hover:underline">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;