import { motion } from 'framer-motion';
import { Star, Quote, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TESTIMONIALS = [
  { id: '1', name: 'Adesuwa & Femi', rating: 5, review: 'Unique Visuals gave us exactly what we wanted for our wedding. The pictures look like they belong in a magazine! Their professionalism was unmatched.', date: 'Oct 2023' },
  { id: '2', name: 'Tunde Bakare', rating: 5, review: 'I hired them for my 40th birthday and they captured the essence of the event perfectly. Highly recommended for anyone looking for premium service.', date: 'Nov 2023' },
  { id: '3', name: 'Zainab O.', rating: 5, review: 'The studio portrait session was a breeze. The team made me feel so comfortable and the final images were stunning. Thank you!', date: 'Jan 2024' },
  { id: '4', name: 'Eko Hotels & Suites', rating: 5, review: 'We use Unique Visuals for all our major corporate events. They are prompt, deliver high-quality editorial images, and are a pleasure to work with.', date: 'Feb 2024' },
];

export default function Testimonials() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, index) => (
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
                    className={i < t.rating ? 'text-gold fill-gold' : 'text-gray-300 dark:text-white/20'}
                  />
                ))}
              </div>
              <p className="text-gray-700 dark:text-white/80 leading-relaxed mb-8">&ldquo;{t.review}&rdquo;</p>
              <div>
                <h4 className="text-gray-900 dark:text-white font-bold tracking-widest uppercase">{t.name}</h4>
                <p className="text-gray-500 dark:text-white/50 text-sm mt-1">{t.date || 'Recent'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <motion.div
          className="bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Have we worked together?
          </h2>
          <p className="text-gray-600 dark:text-white/60 mb-8">
            We'd love to hear about your experience with Unique Visuals.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gold hover:bg-gold-light text-white px-8 py-3 rounded font-bold uppercase tracking-widest transition-colors"
          >
            Share Your Experience
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
