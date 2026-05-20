import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Video, Users, Star, ArrowRight } from 'lucide-react';
import BookingModal from '../components/ui/BookingModal';

const BASE = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/';

const HERO_IMAGES = [
  `${BASE}images/couple.webp`,
  `${BASE}images/img_4744.webp`,
  `${BASE}images/group.webp`,
];

const PORTFOLIO_PREVIEW = [
  { id: 1, url: `${BASE}images/couple-2.webp`, category: "Wedding", span: "col-span-1 row-span-2" },
  { id: 2, url: `${BASE}images/img_4745.webp`, category: "Portrait", span: "col-span-1 row-span-1" },
  { id: 3, url: `${BASE}images/after-party.webp`, category: "Event", span: "col-span-1 row-span-1" },
  { id: 4, url: `${BASE}images/bride-core.webp`, category: "Fashion", span: "col-span-2 md:col-span-2 row-span-1" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-dark min-h-screen">
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />

      <section className="relative h-[100svh] w-full overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <motion.img 
              src={img} 
              alt="Photography hero" 
              className="object-cover w-full h-full"
              initial={{ scale: 1.1 }}
              animate={{ scale: currentSlide === index ? 1 : 1.1 }}
              transition={{ duration: 6, ease: "linear" }}
            />
          </motion.div>
        ))}

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 tracking-wide"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            CAPTURE <span className="text-gold italic">THE</span> MOMENT
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 font-light"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Elite photography services for weddings, portraits, and exclusive events in Ibadan & across Nigeria.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-gold hover:bg-gold-light text-white px-8 py-4 rounded text-sm md:text-base font-bold uppercase tracking-widest transition-colors shadow-[0_4px_24px_rgba(201,168,76,0.3)] w-full sm:w-auto"
            >
              Book a Shoot
            </button>
            <Link 
              to="/portfolio" 
              className="border border-white hover:border-gold hover:text-gold text-white px-8 py-4 rounded text-sm md:text-base font-bold uppercase tracking-widest transition-colors backdrop-blur-sm w-full sm:w-auto"
            >
              View Portfolio
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
               className={`h-3 min-w-[44px] transition-all duration-300 rounded-full ${currentSlide === index ? 'w-12 bg-gold' : 'w-3 bg-white/40'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-[75rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm font-bold text-gold uppercase tracking-[0.2em] mb-4">The Artist Behind the Lens</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">Creating timeless visual narratives.</h3>
          <p className="text-gray-700 dark:text-white/70 text-lg leading-relaxed mb-8">
            At Unique Visuals, we believe every picture tells a story. Based in Ibadan, we travel across Nigeria to capture your most precious moments with an elite, editorial touch. Our passion is to make you look and feel extraordinary.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 text-gray-900 dark:text-white hover:text-gold uppercase tracking-widest text-sm font-bold transition-colors group">
            Read Our Story <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
        <motion.div 
          className="relative h-[400px] md:h-[600px] rounded-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img src={`${BASE}images/_mg_1526.webp`} alt="Photographer" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </motion.div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-dark-secondary">
        <div className="max-w-[75rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-gold uppercase tracking-[0.2em] mb-4">Our Expertise</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">Photography Services</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, title: "Portraiture", desc: "Studio and outdoor editorial portraits that capture your true essence." },
              { icon: Users, title: "Weddings", desc: "Comprehensive coverage of your special day, from bridal prep to reception." },
              { icon: Video, title: "Events", desc: "Professional event coverage for corporate, birthdays, and celebrations." }
            ].map((service, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-dark p-10 rounded-xl border border-gray-200 dark:border-white/5 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <service.icon size={48} className="text-gold mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                <h4 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{service.title}</h4>
                <p className="text-gray-700 dark:text-white/70 leading-relaxed mb-6">{service.desc}</p>
                <Link to="/services" className="text-gold text-sm font-bold uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors">
                  Learn More
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-[75rem] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-sm font-bold text-gold uppercase tracking-[0.2em] mb-4">Selected Works</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">Featured Portfolio</h3>
          </div>
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-gray-900 dark:text-white hover:text-gold uppercase tracking-widest text-sm font-bold transition-colors group">
            View All Work <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 md:h-[800px] auto-rows-[250px] md:auto-rows-auto">
          {PORTFOLIO_PREVIEW.map((item, index) => (
            <motion.div 
              key={item.id}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${item.span}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <img src={item.url} alt={item.category} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white font-display text-xl md:text-2xl font-bold tracking-wider">{item.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-dark-secondary dark:to-dark">
        <div className="max-w-[75rem] mx-auto px-6 text-center">
          <Star className="text-gold mx-auto mb-6" size={48} strokeWidth={1} />
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-12 max-w-3xl mx-auto leading-tight">
            "Unique Visuals gave us exactly what we wanted for our wedding. The pictures look like they belong in a magazine!"
          </h2>
          <p className="text-gold font-bold tracking-widest uppercase mb-2">Adesuwa & Femi</p>
          <p className="text-gray-500 dark:text-white/50 text-sm">Wedding Clients</p>
          <div className="mt-12">
            <Link to="/testimonials" className="text-gray-900 dark:text-white hover:text-gold border border-gray-300 dark:border-white/20 hover:border-gold hover:bg-gray-50 dark:hover:bg-white/5 px-8 py-4 rounded text-sm font-bold uppercase tracking-widest transition-colors inline-block">
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 dark:bg-dark z-0" />
        <div className="absolute inset-0 bg-cover bg-center opacity-10 z-0 mix-blend-overlay" style={{ backgroundImage: `url(${BASE}images/_mg_0970.webp)` }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8">Ready to create magic?</h2>
          <p className="text-xl text-white/60 mb-12">Let's discuss your next shoot and bring your vision to life.</p>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-gold hover:bg-gold-light text-white px-10 py-5 rounded text-lg font-bold uppercase tracking-widest transition-colors shadow-[0_4px_24px_rgba(201,168,76,0.3)] w-full sm:w-auto"
          >
            Let's Talk
          </button>
        </div>
      </section>
    </div>
  );
}
