import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Calendar, LogOut, Trash2, Edit3 } from 'lucide-react';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || ''
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log('Profile updated to:', editForm);
    setIsEditing(false);
    alert('Profile updated successfully (Stub)');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      console.log('Account deleted');
      alert('Account deleted successfully (Stub)');
      handleLogout();
    }
  };

  const dummyBookings = [
    { id: 'BK-1029', service: 'Wedding Photography', date: 'Oct 15, 2025', status: 'Confirmed' },
    { id: 'BK-0941', service: 'Engagement Session', date: 'May 10, 2025', status: 'Completed' }
  ];

  return (
    <div className="bg-white dark:bg-dark text-gray-900 dark:text-white min-h-screen pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        <div className="flex flex-col md:flex-row gap-8">

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full md:w-1/4 space-y-4"
          >
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-3xl backdrop-blur-sm text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-white/20 rounded-full flex items-center justify-center mb-4 text-gold text-3xl font-light uppercase">
                {currentUser?.displayName ? currentUser.displayName.charAt(0) : <User size={40} />}
              </div>
              <h3 className="text-xl font-medium">{currentUser?.displayName || 'Client'}</h3>
              <p className="text-sm text-gray-600 dark:text-white/50 mt-1 truncate">{currentUser?.email}</p>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-colors duration-300 ${activeTab === 'profile' ? 'bg-gold text-white' : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <User size={18} /> My Profile
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-colors duration-300 ${activeTab === 'bookings' ? 'bg-gold text-white' : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <Calendar size={18} /> My Bookings
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-colors duration-300 ${activeTab === 'settings' ? 'bg-gold text-white' : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <Settings size={18} /> Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-gray-500 dark:text-white/60 transition-colors duration-300 mt-4"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-3/4"
          >
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm min-h-[500px]">

              {activeTab === 'profile' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-6">
                    <div>
                      <h2 className="text-2xl font-semibold">Personal Information</h2>
                      <p className="text-gray-600 dark:text-white/50 text-sm mt-1">Update your personal details here.</p>
                    </div>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-sm text-gold hover:text-white transition-colors px-4 py-2 bg-gold/10 rounded-full"
                      >
                        <Edit3 size={16} /> Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          value={editForm.displayName}
                          onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                          className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none opacity-50 cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Email address cannot be changed currently.</p>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="submit"
                          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-full hover:bg-gold hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2.5 bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-medium rounded-full hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/40 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8 max-w-lg">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white/50 mb-1">Full Name</p>
                        <p className="text-lg font-medium">{currentUser?.displayName || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white/50 mb-1">Email Address</p>
                        <p className="text-lg font-medium">{currentUser?.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white/50 mb-1">Account Role</p>
                        <p className="text-lg font-medium capitalize">{currentUser?.role || 'Client'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="border-b border-gray-200 dark:border-white/10 pb-6">
                    <h2 className="text-2xl font-semibold">My Bookings</h2>
                    <p className="text-gray-600 dark:text-white/50 text-sm mt-1">View your past and upcoming photography sessions.</p>
                  </div>

                  <div className="space-y-4">
                    {dummyBookings.length > 0 ? (
                      dummyBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-1 rounded">{booking.id}</span>
                              <h4 className="text-lg font-medium">{booking.service}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-sm">
                              <Calendar size={14} /> {booking.date}
                            </div>
                          </div>
                          <div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Calendar size={48} className="mx-auto text-gray-300 dark:text-white/10 mb-4" />
                        <p className="text-gray-600 dark:text-white/60">You don't have any bookings yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="border-b border-gray-200 dark:border-white/10 pb-6">
                    <h2 className="text-2xl font-semibold">Account Settings</h2>
                    <p className="text-gray-600 dark:text-white/50 text-sm mt-1">Manage your account preferences and security.</p>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-500">
                        <Trash2 size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-red-500 mb-2">Delete Account</h4>
                        <p className="text-sm text-gray-600 dark:text-white/60 mb-6 leading-relaxed">
                          Once you delete your account, there is no going back. Please be certain. 
                          All your data, bookings, and testimonials will be permanently removed from our servers.
                        </p>
                        <button 
                          onClick={handleDeleteAccount}
                          className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
