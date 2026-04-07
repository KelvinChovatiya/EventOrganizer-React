import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // State to hold the dynamic user data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch the real user data when the page loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Try to get fresh profile data from the backend
          const userRes = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserData({
            name: userRes.data.name || '',
            email: userRes.data.email || '',
            phone: userRes.data.phone || ''
          });
        } catch (err) {
          // Fallback: Check local storage if the API call fails
          const storedUser = localStorage.getItem('user') || localStorage.getItem('userInfo');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserData({
              name: parsed.name || '',
              email: parsed.email || '',
              phone: parsed.phone || ''
            });
          }
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  // Helper to dynamically calculate initials (e.g., "Kris Kalariya" -> "KK")
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // TODO: Wire up actual password change API route later
    setShowSuccessModal(true);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // TODO: Wire up actual profile update API route later
    alert('Profile update submitted!');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans text-slate-900 relative">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row shadow-sm rounded-2xl overflow-hidden border border-slate-200 bg-white">
        
        {/* LEFT SIDE: User Avatar Card (Black) */}
        <div className="w-full md:w-2/5 bg-black p-12 flex flex-col items-center justify-center text-center">
          <div className="h-32 w-32 rounded-full bg-[#F95A00] flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-lg shadow-orange-500/20">
            {getInitials(userData.name)}
          </div>
          <h2 className="text-3xl font-bold text-white">{userData.name || 'User Profile'}</h2>
          <p className="text-slate-400 mt-2 text-sm">Attendee Account</p>
        </div>

        {/* RIGHT SIDE: Settings Form (White) */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          
          {/* View: Account Settings */}
          {activeTab === 'profile' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Account Settings</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={userData.phone}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      placeholder="Enter mobile number"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={userData.email}
                    disabled // Disable email editing as it's usually tied to login
                    className="w-full rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed px-4 py-3 text-sm focus:outline-none"
                  />
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    type="submit"
                    className="flex-1 rounded-lg bg-[#F95A00] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                  >
                    Update Profile
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('password')}
                    className="flex-1 rounded-lg border border-[#F95A00] bg-white px-6 py-3.5 text-sm font-bold text-[#F95A00] hover:bg-orange-50 active:scale-95 transition-all"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* View: Change Password */
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="text-sm font-bold text-slate-400 hover:text-[#F95A00] transition-colors"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">New Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Create new password"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto rounded-lg bg-[#F95A00] px-10 py-3.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          )}
          
        </div>
      </div>

      {/* SUCCESS MODAL OVERLAY */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl relative text-center animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-8">
              Your <br /> Password <br /> has Changed
            </h2>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                setActiveTab('profile'); 
              }}
              className="w-full rounded-lg bg-[#F95A00] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition-all active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfilePage;