import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const DUMMY_TESTIMONIALS = [
  { id: '1', name: 'Adesuwa & Femi', rating: 5, review: 'Unique Visuals gave us exactly what we wanted for our wedding. The pictures look like they belong in a magazine! Their professionalism was unmatched.', date: 'Oct 2023' },
  { id: '2', name: 'Tunde Bakare', rating: 5, review: 'I hired them for my 40th birthday and they captured the essence of the event perfectly. Highly recommended for anyone looking for premium service.', date: 'Nov 2023' },
  { id: '3', name: 'Zainab O.', rating: 5, review: 'The studio portrait session was a breeze. The team made me feel so comfortable and the final images were stunning. Thank you!', date: 'Jan 2024' },
  { id: '4', name: 'Eko Hotels & Suites', rating: 5, review: 'We use Unique Visuals for all our major corporate events. They are prompt, deliver high-quality editorial images, and are a pleasure to work with.', date: 'Feb 2024' },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(collection(db, 'testimonials'), where('approved', '==', true), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (fetched.length > 0) {
          setTestimonials(fetched);
        } else {
          setTestimonials(DUMMY_TESTIMONIALS);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials(DUMMY_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        userId: currentUser.uid,
        name: currentUser.displayName || 'Anonymous User',
        rating,
        review,
        approved: false,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setReview('');
      setRating(5);
      addNotification('Thank you! Your review has been submitted and is pending approval.');
    } catch (error) {
      console.error("Error adding review:", error);
      addNotification('Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-32 pb-24">
      <section className="max-w-[75rem] mx-auto px-6 mb-20 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-white/60 text-sm mb-6">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white">Testimonials</span>
        </div>

        <motion.h1 
          className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Client <span className="text-gold italic">Love</span>
        </motion.h1>

        <motion.p 
          className="text-xl text-gray-700 dark:text-white/70 max-w-2xl mx-auto font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Don't just take our word for it. Read what our clients have to say about their Unique Visuals experience.
        </motion.p>
      </section>

      <section className="max-w-[75rem] mx-auto px-6 mb-24">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-10 h-10 border-4 border-gray-200 dark:border-white/20 border-t-gold rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                className="bg-gray-50 dark:bg-dark-secondary p-8 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-gold/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Quote className="absolute top-6 right-6 text-gold/20" size={48} />
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < t.rating ? "text-gold fill-gold" : "text-gray-300 dark:text-white/20"} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-white/80 leading-relaxed mb-8 min-h-[100px]">"{t.review}"</p>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold tracking-widest uppercase">{t.name}</h4>
                  <p className="text-gray-500 dark:text-white/50 text-sm mt-1">{t.date || "Recent"}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <motion.div 
          className="bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Have we worked together?</h2>
          <p className="text-gray-600 dark:text-white/60 mb-8">We'd love to hear about your experience with Unique Visuals.</p>

          {!showForm ? (
            currentUser ? (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-gold hover:bg-gold-light text-white px-8 py-3 rounded font-bold uppercase tracking-widest transition-colors"
              >
                Write a Review
              </button>
            ) : (
              <Link 
                to="/login"
                className="inline-block bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white px-8 py-3 rounded font-bold uppercase tracking-widest transition-colors"
              >
                Log in to Review
              </Link>
            )
          ) : (
            <form onSubmit={handleSubmit} className="text-left mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-white/60 mb-2 uppercase tracking-wider">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="focus:outline-none p-1.5"
                    >
                      <Star size={32} className={num <= rating ? "text-gold fill-gold" : "text-gray-300 dark:text-white/20"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-white/60 mb-2 uppercase tracking-wider">Your Review</label>
                <textarea 
                  required 
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="4" 
                  className="w-full bg-gray-100 dark:bg-dark-secondary border border-gray-200 dark:border-white/10 rounded px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors resize-none" 
                  placeholder="Share your experience..."
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gold hover:bg-gold-light text-white font-bold uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 border border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40 text-gray-900 dark:text-white rounded font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
}
