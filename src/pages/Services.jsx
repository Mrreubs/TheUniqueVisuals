import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Camera, Users, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    icon: Users,
    title: 'Wedding Photography',
    price: 'From ₦450,000',
    desc: 'Comprehensive coverage of your special day, capturing every emotion and celebration from preparation to the final dance.',
    features: [
      'Pre-wedding shoot included',
      'Full day coverage (up to 12 hours)',
      'Two professional photographers',
      '500+ edited high-resolution images',
      'Premium layflat photo album',
      'Online private gallery',
    ],
    popular: true,
  },
  {
    icon: Camera,
    title: 'Portrait & Lifestyle',
    price: 'From ₦100,000',
    desc: 'Editorial-style portraits for individuals, couples, and families. Perfect for birthdays, anniversaries, or personal branding.',
    features: [
      '2-hour studio or outdoor session',
      'Multiple outfit changes',
      'Creative direction & posing guidance',
      '25 expertly retouched images',
      'Online private gallery',
    ],
    popular: false,
  },
  {
    icon: Camera,
    title: 'Event Coverage',
    price: 'From ₦150,000',
    desc: 'Professional photography for corporate events, galas, birthdays, and private parties.',
    features: [
      'Up to 6 hours coverage',
      'Roving & stage photography',
      'Quick 48-hour turnaround for PR',
      'All good images color-corrected',
      'Online private gallery',
    ],
    popular: false,
  },
  {
    icon: Gem,
    title: 'Fashion & Commercial',
    price: 'Custom Quote',
    desc: 'High-end campaigns, lookbooks, and product photography for brands that want to stand out.',
    features: [
      'Concept development & moodboards',
      'Studio or location scouting',
      'Advanced editorial retouching',
      'Commercial usage rights',
      'Custom deliverables',
    ],
    popular: false,
  },
];

export default function Services() {
  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-32 pb-24">
      <section className="max-w-[75rem] mx-auto px-6 mb-20 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-white/60 text-sm mb-6">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white">Services</span>
        </div>

        <motion.h1
          className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our <span className="text-gold italic">Expertise</span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-700 dark:text-white/70 max-w-2xl mx-auto font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Premium photography packages tailored to your unique needs. We deliver uncompromising quality and an elite
          experience.
        </motion.p>
      </section>

      <section className="max-w-[75rem] mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              className={`bg-white dark:bg-dark-secondary border rounded-2xl p-8 md:p-10 relative overflow-hidden ${
                service.popular
                  ? 'border-gold'
                  : 'border-gray-200 dark:border-white/10 hover:border-gold/30'
              } transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {service.popular && (
                <div className="absolute top-6 right-6 bg-gold text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <service.icon size={48} className="text-gold mb-6" strokeWidth={1} />

              <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
              <p className="text-gold font-bold tracking-widest uppercase mb-6">{service.price}</p>

              <p className="text-gray-700 dark:text-white/70 leading-relaxed mb-8">{service.desc}</p>

              <div className="space-y-4 mb-10">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-gold shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className={`block text-center py-4 rounded text-sm font-bold uppercase tracking-widest transition-colors ${
                  service.popular
                    ? 'bg-gold hover:bg-gold-light text-white'
                    : 'bg-transparent border border-gray-300 dark:border-white hover:border-gold hover:text-gold text-gray-900 dark:text-white'
                }`}
              >
                Book This Package
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-[75rem] mx-auto px-6">
        <motion.div
          className="bg-gray-50 dark:bg-dark border border-gold/30 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gold/5 z-0" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Looking for something else?
            </h2>
            <p className="text-gray-700 dark:text-white/70 max-w-2xl mx-auto mb-10">
              Every project is unique. If you don't see a package that fits your exact needs, reach out to us for a
              custom quote tailored specifically for you.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gold hover:bg-gold-light text-white px-10 py-4 rounded font-bold uppercase tracking-widest transition-colors shadow-[0_4px_24px_rgba(201,168,76,0.3)]"
            >
              Request Custom Quote
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
