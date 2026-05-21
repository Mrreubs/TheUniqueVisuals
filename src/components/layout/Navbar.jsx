import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Services', path: '/services' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }
    setIsScrolled(false);
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const linkColor = isScrolled
    ? 'text-gray-900 dark:text-white'
    : 'text-white';

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wider uppercase transition-colors hover:text-gold ${
      isActive ? 'text-gold' : linkColor
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `text-2xl font-display uppercase tracking-widest transition-colors ${
      isActive ? 'text-gold' : 'text-gray-900 dark:text-white'
    }`;

  function renderLinks(linkClass, onClick) {
    return NAV_LINKS.map((link) => (
      <li key={link.path}>
        <NavLink to={link.path} className={linkClass} onClick={onClick}>
          {link.name}
        </NavLink>
      </li>
    ));
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-dark/95 backdrop-blur-md shadow-lg'
            : 'bg-black/20 md:bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[75rem] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 transition-colors ${linkColor}`}>
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Unique Visuals"
              className="h-10 sm:h-12 w-auto"
            />
            <span className="font-display font-bold text-xs sm:text-sm 2xl:text-base tracking-wide whitespace-nowrap">
              Unique Visuals
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <ul className="flex items-center gap-6">
              {renderLinks(navLinkClass)}
            </ul>

            <Link
              to="/contact"
              className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors shadow-[0_4px_14px_rgba(201,168,76,0.2)]"
            >
              Book a Shoot
            </Link>
          </div>

          <button
            className={`md:hidden p-2.5 transition-colors hover:text-gold ${linkColor}`}
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              key="panel"
              className="fixed top-0 right-0 z-50 w-auto min-w-[280px] max-w-[85vw] max-h-[100dvh] overflow-y-auto bg-white dark:bg-dark flex flex-col shadow-2xl rounded-bl-3xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="p-6 flex justify-end">
                <button
                  className="text-gray-900 dark:text-white hover:text-gold transition-colors p-2"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-8 px-8">
                <ul className="flex flex-col items-center gap-6">
                  {renderLinks(mobileLinkClass, () => setIsMobileOpen(false))}
                </ul>

                <Link
                  to="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full text-center bg-gold hover:bg-gold-light text-white py-4 rounded text-lg font-bold uppercase tracking-widest transition-colors"
                >
                  Book a Shoot
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
