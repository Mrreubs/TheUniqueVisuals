import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-dark pt-16 pb-8 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-[75rem] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="block mb-4">
            <img src="/logo.png" alt="Unique Visuals" className="h-12 w-auto" />
          </Link>
          <p className="text-gray-600 dark:text-white/60 mb-6 max-w-sm">
            Capturing timeless moments with an elite touch. We specialize in wedding, portrait, and event photography across Nigeria.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:border-gold hover:text-gold hover:bg-gold/10 hover:-translate-y-1 transition-all duration-300">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:border-gold hover:text-gold hover:bg-gold/10 hover:-translate-y-1 transition-all duration-300">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:border-gold hover:text-gold hover:bg-gold/10 hover:-translate-y-1 transition-all duration-300">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-gray-900 dark:text-white font-bold tracking-widest uppercase mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            <li><Link to="/about" className="text-gray-600 dark:text-white/60 hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/portfolio" className="text-gray-600 dark:text-white/60 hover:text-gold transition-colors">Portfolio</Link></li>
            <li><Link to="/services" className="text-gray-600 dark:text-white/60 hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/testimonials" className="text-gray-600 dark:text-white/60 hover:text-gold transition-colors">Testimonials</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-900 dark:text-white font-bold tracking-widest uppercase mb-6">Contact</h4>
          <ul className="flex flex-col gap-3 text-gray-600 dark:text-white/60">
            <li>7, Abese Estate, Elebu, Ibadan, Oyo State, Nigeria</li>
            <li><a href="mailto:Theuniquevisuals15@gmail.com" className="hover:text-gold transition-colors">Theuniquevisuals15@gmail.com</a></li>
            <li><a href="tel:+2348164877157" className="hover:text-gold transition-colors">+234 816 487 7157</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[75rem] mx-auto px-6 border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 dark:text-white/40">
        <p>&copy; {new Date().getFullYear()} Unique Visuals. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
