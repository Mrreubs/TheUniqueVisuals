import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase/config';
import { collection, query, getDocs, doc, deleteDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  BarChart3,
  Image as ImageIcon,
  Users,
  MessageSquare,
  LogOut,
  Upload,
  Trash2,
  Calendar,
} from 'lucide-react';

function BarChart({ data, title }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-3xl">
      <h3 className="text-xl font-medium mb-6">{title}</h3>
      <div className="flex items-end h-64 gap-4">
        {data.map((item, idx) => {
          const height = (item.value / max) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full h-full flex items-end justify-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                  className="w-full max-w-[40px] bg-gold/80 group-hover:bg-gold transition-colors rounded-t-lg relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    {item.value}
                  </div>
                </motion.div>
              </div>
              <span className="text-xs text-gray-600 dark:text-white/60 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CHART_DATA = [
  { label: 'Jan', value: 45 },
  { label: 'Feb', value: 52 },
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 65 },
  { label: 'May', value: 89 },
  { label: 'Jun', value: 72 },
];

const CATEGORY_VIEWS = [
  { label: 'Wedding', value: 1250 },
  { label: 'Portrait', value: 840 },
  { label: 'Fashion', value: 620 },
  { label: 'Event', value: 930 },
];

const TABS = [
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'portfolio', label: 'Portfolio Upload', icon: ImageIcon },
  { key: 'users', label: 'Clients', icon: Users },
  { key: 'content', label: 'Reviews', icon: MessageSquare },
];

export default function Dashboard() {
  const { signOut } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');

  const [stats, setStats] = useState({ users: 0, bookings: 0, testimonials: 0 });
  const [usersList, setUsersList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [uploadForm, setUploadForm] = useState({ category: 'Wedding', file: null });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoadingData(true);
    try {
      if (activeTab === 'analytics' || activeTab === 'users') {
        const usersSnap = await getDocs(collection(db, 'users'));
        setStats((prev) => ({ ...prev, users: usersSnap.size }));
        setUsersList(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
      if (activeTab === 'analytics') {
        const bookingsSnap = await getDocs(collection(db, 'bookings'));
        setStats((prev) => ({ ...prev, bookings: bookingsSnap.size }));
      }
      if (activeTab === 'analytics' || activeTab === 'content') {
        const testQ = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(testQ);
        setStats((prev) => ({ ...prev, testimonials: snapshot.size }));
        setTestimonialsList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadForm.file) {
      addNotification('Please select an image file', 'error');
      return;
    }
    setIsUploading(true);
    try {
      const fileRef = ref(storage, `portfolio/${uploadForm.category}/${Date.now()}_${uploadForm.file.name}`);
      await uploadBytes(fileRef, uploadForm.file);
      const url = await getDownloadURL(fileRef);
      await addDoc(collection(db, 'portfolio'), {
        url,
        category: uploadForm.category,
        title: uploadForm.category,
        createdAt: serverTimestamp(),
      });
      addNotification('Image uploaded to portfolio successfully!');
      setUploadForm({ category: 'Wedding', file: null });
    } catch (err) {
      console.error('Upload failed:', err);
      addNotification('Upload failed. Ensure Firebase Storage and Firestore are enabled.', 'error');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteTestimonial(id) {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
      addNotification('Deleted successfully');
    } catch (err) {
      console.error('Error deleting', err);
      addNotification('Failed to delete. Check permissions.', 'error');
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Delete this user? (Warning: This only deletes the Firestore doc, not their Auth account)'))
      return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsersList((prev) => prev.filter((u) => u.id !== id));
      addNotification('Deleted successfully');
    } catch (err) {
      console.error('Error deleting user', err);
      addNotification('Failed to delete. Check permissions.', 'error');
    }
  }

  const statCards = [
    { icon: Users, value: stats.users, label: 'Registered Clients' },
    { icon: Calendar, value: stats.bookings, label: 'Total Bookings Recorded' },
    { icon: MessageSquare, value: stats.testimonials, label: 'Testimonials Submitted' },
  ];

  return (
    <div className="bg-white dark:bg-dark text-gray-900 dark:text-white min-h-screen pt-24 pb-16">
      <div className="max-w-[75rem] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full lg:w-64 flex-shrink-0 space-y-4"
          >
            <div className="mb-8 px-4">
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-gold text-sm">Unique Visuals</p>
            </div>

            <nav className="space-y-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-gold text-white shadow-md'
                      : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:translate-x-1'
                  }`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
              <div className="pt-8">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-gray-600 dark:text-white/60 transition-colors duration-300"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="w-full flex-grow"
          >
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-semibold">Dashboard Overview</h2>
                  {loadingData && (
                    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {statCards.map((card, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-3xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold">
                          <card.icon size={24} />
                        </div>
                      </div>
                      <h4 className="text-3xl font-medium mb-1">{card.value}</h4>
                      <p className="text-gray-600 dark:text-white/60 text-sm">{card.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <BarChart data={CHART_DATA} title="Monthly Site Visitors (Demo)" />
                  <BarChart data={CATEGORY_VIEWS} title="Views by Category (Demo)" />
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <h2 className="text-3xl font-semibold mb-2">Manage Portfolio</h2>
                <p className="text-gray-600 dark:text-white/60 mb-8">
                  Upload new images to your portfolio categories. They will be saved to Firebase Storage.
                </p>

                <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl max-w-2xl">
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">
                        Select Category
                      </label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:border-gold outline-none appearance-none"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">
                        Upload Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-12 text-center hover:border-gold transition-colors relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload size={32} className="mx-auto text-gray-400 dark:text-white/60 mb-4 group-hover:text-gold transition-colors" />
                        <p className="text-gray-900 dark:text-white font-medium mb-1">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-sm text-gray-600 dark:text-white/60">JPG, PNG, WebP up to 5MB</p>
                        {uploadForm.file && (
                          <div className="mt-4 text-gold bg-gold/10 py-2 px-4 rounded-full inline-block text-sm">
                            Selected: {uploadForm.file.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full py-3.5 bg-gold text-white font-medium rounded-xl hover:bg-gold/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    >
                      {isUploading && (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      {isUploading ? 'Uploading to Firebase...' : 'Upload to Portfolio'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <h2 className="text-3xl font-semibold mb-2">Client Management</h2>

                <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                          <th className="p-4 font-medium text-gray-600 dark:text-white/60 text-sm">Name</th>
                          <th className="p-4 font-medium text-gray-600 dark:text-white/60 text-sm">Email</th>
                          <th className="p-4 font-medium text-gray-600 dark:text-white/60 text-sm">Role</th>
                          <th className="p-4 font-medium text-gray-600 dark:text-white/60 text-sm text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-6 text-center text-gray-600 dark:text-white/60">
                              No users found or Firebase not configured.
                            </td>
                          </tr>
                        ) : (
                          usersList.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                              <td className="p-4 text-gray-900 dark:text-white font-medium">
                                {user.displayName || 'Unknown'}
                              </td>
                              <td className="p-4 text-gray-600 dark:text-white/60">{user.email}</td>
                              <td className="p-4 text-gray-600 dark:text-white/60 capitalize">{user.role || 'client'}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <h2 className="text-3xl font-semibold mb-2">Manage Testimonials & Reviews</h2>
                <p className="text-gray-600 dark:text-white/60">Review and moderate client submissions from Firestore.</p>

                <div className="space-y-4">
                  {testimonialsList.length === 0 ? (
                    <div className="p-6 text-center text-gray-600 dark:text-white/60 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                      No testimonials found.
                    </div>
                  ) : (
                    testimonialsList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex justify-between items-start gap-4"
                      >
                        <div>
                          <div className="flex gap-2 items-center mb-2">
                            <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded">
                              {item.rating} Stars
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                            <span className="text-xs text-gray-600 dark:text-white/60 ml-2">{item.date}</span>
                          </div>
                          <p className="text-gray-600 dark:text-white/60 text-sm line-clamp-2">&ldquo;{item.review}&rdquo;</p>
                        </div>
                        <button
                          onClick={() => handleDeleteTestimonial(item.id)}
                          className="text-red-500 hover:bg-red-500/10 p-3 rounded-lg flex-shrink-0 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
