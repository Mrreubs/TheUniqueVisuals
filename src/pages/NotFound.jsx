import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark px-6">
      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-8xl font-display font-bold text-gold mb-6">404</div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Page not found
        </h1>
        <p className="text-gray-600 dark:text-white/60 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-gold hover:bg-gold-light text-white px-10 py-4 rounded font-bold uppercase tracking-widest transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
