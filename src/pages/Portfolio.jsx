import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const BASE = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/';
const CATEGORIES = ['All', 'Wedding', 'Portrait', 'Fashion', 'Event'];

const DUMMY_PORTFOLIO = [
  { id: '1', url: `${BASE}images/couple.webp`, category: "Wedding", title: "Adesuwa & Femi" },
  { id: '2', url: `${BASE}images/girls-2.webp`, category: "Portrait", title: "Studio Session" },
  { id: '3', url: `${BASE}images/group.webp`, category: "Event", title: "Gala Night" },
  { id: '4', url: `${BASE}images/couple-core.webp`, category: "Fashion", title: "Vogue Editorial" },
  { id: '5', url: `${BASE}images/couple-3.webp`, category: "Wedding", title: "The Vows" },
  { id: '6', url: `${BASE}images/men.webp`, category: "Portrait", title: "Golden Hour" },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const q = query(collection(db, 'portfolio'), orderBy('uploadedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedImages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (fetchedImages.length > 0) {
          setImages(fetchedImages);
        } else {
          setImages(DUMMY_PORTFOLIO);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setImages(DUMMY_PORTFOLIO);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-32 pb-24">
      <section className="max-w-[75rem] mx-auto px-6 mb-16 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-white/60 text-sm mb-6">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white">Portfolio</span>
        </div>

        <motion.h1 
          className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Selected <span className="text-gold italic">Works</span>
        </motion.h1>

        <motion.p 
          className="text-gray-700 dark:text-white/70 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Explore our collection of timeless moments, captured across Nigeria.
        </motion.p>

        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
               className={`px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-gold text-white'
                  : 'bg-transparent text-gray-600 dark:text-white border border-gray-300 dark:border-white/20 hover:border-gold hover:text-gold'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </section>

      <section className="max-w-[75rem] mx-auto px-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-white/20 border-t-gold rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="relative group rounded-xl overflow-hidden cursor-pointer break-inside-avoid"
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img.url} 
                    alt={img.title || img.category} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-gold text-xs font-bold uppercase tracking-widest mb-1">{img.category}</span>
                    <h3 className="text-white font-display text-xl font-bold">{img.title || "Untitled"}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 dark:bg-dark/95 backdrop-blur-sm p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
             <button 
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-2.5 z-[110]"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title || selectedImage.category} 
                className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
              />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-display font-bold text-white mb-2">{selectedImage.title || "Untitled"}</h3>
                <p className="text-gold font-bold uppercase tracking-widest text-sm">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
