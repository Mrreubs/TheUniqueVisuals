import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, userRole, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsScrolled(!isHome);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  const linkColor = isScrolled ? 'text-gray-900' : 'text-white';

  return (
    <>
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-dark/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[75rem] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={`/`} className={`flex items-center gap-2 transition-colors ${linkColor} dark:text-white`}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Unique Visuals" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wider uppercase transition-colors hover:text-gold ${
                      isActive ? 'text-gold' : `${linkColor} dark:text-white`
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            {currentUser && (
              <li>
                <NavLink
                  to={userRole === 'admin' ? '/admin' : '/profile'}
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wider uppercase transition-colors hover:text-gold ${
                      isActive ? 'text-gold' : `${linkColor} dark:text-white`
                    }`
                  }
                >
                  {userRole === 'admin' ? 'Dashboard' : 'Profile'}
                </NavLink>
              </li>
            )}
          </ul>

          <div className={`flex items-center gap-4 border-l pl-6 transition-colors ${isScrolled ? 'border-gray-200 dark:border-white/20' : 'border-white/20'}`}>
            <button
              onClick={toggleTheme}
              className={`transition-colors p-2.5 ${linkColor} dark:text-white hover:text-gold`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {currentUser ? (
              <button
                onClick={signOut}
                className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-gold ${linkColor} dark:text-white`}
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-gold ${linkColor} dark:text-white`}
              >
                Sign In
              </Link>
            )}
            <Link
              to="/contact"
              className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors shadow-[0_4px_14px_rgba(201,168,76,0.2)]"
            >
              Book a Shoot
            </Link>
          </div>
        </div>

        <button
          className={`md:hidden p-2.5 transition-colors hover:text-gold ${linkColor} dark:text-white`}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

    </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        {isMobileMenuOpen && (
          <motion.div
            key="panel"
            className="fixed inset-y-0 right-0 z-50 w-auto min-w-[280px] max-w-[85vw] bg-white dark:bg-dark flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="p-6 flex justify-end">
              <button
                className="text-gray-900 dark:text-white hover:text-gold transition-colors p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <ul className="flex flex-col items-center gap-6">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-2xl font-display uppercase tracking-widest transition-colors ${
                          isActive ? 'text-gold' : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
                {currentUser && (
                  <li>
                    <NavLink
                      to={userRole === 'admin' ? '/admin' : '/profile'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-2xl font-display uppercase tracking-widest transition-colors ${
                          isActive ? 'text-gold' : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {userRole === 'admin' ? 'Dashboard' : 'Profile'}
                    </NavLink>
                  </li>
                )}
              </ul>

              <div className="flex flex-col items-center gap-6 mt-8 w-full px-12">
                <button
                  onClick={toggleTheme}
                  className="text-gray-900 dark:text-white hover:text-gold transition-colors p-2.5"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>

                {currentUser ? (
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg text-gray-900 dark:text-white hover:text-gold uppercase tracking-wider transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg text-gray-900 dark:text-white hover:text-gold uppercase tracking-wider transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-gold hover:bg-gold-light text-white py-4 rounded text-lg font-bold uppercase tracking-widest transition-colors"
                >
                  Book a Shoot
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
