import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function BookingModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    type: '',
    date: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        userId: currentUser ? currentUser.uid : 'guest',
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: currentUser?.displayName || '',
          email: currentUser?.email || '',
          phone: '',
          type: '',
          date: '',
          message: ''
        });
        onClose();
      }, 3000);

    } catch (error) {
      console.error("Error adding booking: ", error);
      addNotification("Failed to send booking request. Ensure Firebase is set up.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-0 z-[70] m-auto h-fit max-h-[90vh] w-[90%] max-w-2xl bg-white dark:bg-dark border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Book a <span className="text-gold">Shoot</span>
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors p-2.5"
                >
                  <X size={24} />
                </button>
              </div>

              {success ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Sent!</h3>
                  <p className="text-gray-600 dark:text-white/60">We'll get back to you shortly to confirm your booking.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 uppercase tracking-wider">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 uppercase tracking-wider">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 uppercase tracking-wider">Phone Number</label>
                      <input 
                        required 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors" 
                        placeholder="+234..." 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 uppercase tracking-wider">Type of Shoot</label>
                      <select 
                        required 
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors appearance-none"
                      >
                        <option value="">Select a category</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Event">Event</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 uppercase tracking-wider">Preferred Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 uppercase tracking-wider">Message / Details</label>
                    <textarea 
                      rows="4" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors resize-none" 
                      placeholder="Tell us more about your shoot..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold/90 text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
                  >
                    {isSubmitting && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {isSubmitting ? 'Sending...' : 'Submit Request'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
