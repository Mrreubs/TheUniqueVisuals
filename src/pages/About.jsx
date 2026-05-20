import { motion } from 'framer-motion';
import { Award, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/';

export default function About() {
  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '500+', label: 'Weddings Covered' },
    { value: '150+', label: 'Awards Won' },
    { value: '10k+', label: 'Happy Clients' },
  ];

  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-32 pb-24">
      <section className="max-w-[75rem] mx-auto px-6 mb-24">
        <div className="flex items-center gap-2 text-gray-500 dark:text-white/60 text-sm mb-8">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white">About Us</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Capturing life's <br />
              <span className="text-gold italic">purest</span> moments.
            </h1>
            <p className="text-xl text-gray-700 dark:text-white/70 font-light mb-8 max-w-lg leading-relaxed">
              Based in Ibadan, Unique Visuals is a premium photography studio dedicated to turning your fleeting moments into eternal masterpieces.
            </p>
          </motion.div>
          <motion.div
            className="h-[400px] md:h-[500px] rounded-xl overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <img 
              src={`${BASE}images/_mg_0970.webp`} 
              alt="Photographer at work" 
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-secondary py-16 mb-24">
        <div className="max-w-[75rem] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-gold mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-white/50 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[75rem] mx-auto px-6 mb-24 grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm font-bold text-gold uppercase tracking-[0.2em] mb-4">Our Story</h2>
          <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">Born from a passion for visual storytelling</h3>
          <p className="text-gray-700 dark:text-white/70 leading-relaxed mb-6">
            Founded over a decade ago, Unique Visuals started with a simple camera and an immense dream: to document the world's beauty through the lens of authenticity. What started in a small studio in Elebu, Ibadan, has blossomed into one of Nigeria's most sought-after photography brands.
          </p>
          <p className="text-gray-700 dark:text-white/70 leading-relaxed">
            We don't just take pictures; we craft visual legacies. Every click of the shutter is an attempt to freeze time, preserving the raw emotions, the stolen glances, and the vibrant celebrations that define our human experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-sm font-bold text-gold uppercase tracking-[0.2em] mb-4">Our Approach</h2>

          <div className="flex gap-4">
            <div className="mt-1"><Heart className="text-gold shrink-0" size={24} /></div>
            <div>
              <h4 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Authentic Emotion</h4>
              <p className="text-gray-700 dark:text-white/70 leading-relaxed">We focus on capturing genuine, candid moments rather than stiff poses. We want your photos to feel like you.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1"><Award className="text-gold shrink-0" size={24} /></div>
            <div>
              <h4 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Editorial Quality</h4>
              <p className="text-gray-700 dark:text-white/70 leading-relaxed">Every image goes through our meticulous post-production process to ensure a premium, magazine-ready finish.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1"><CheckCircle2 className="text-gold shrink-0" size={24} /></div>
            <div>
              <h4 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Seamless Experience</h4>
              <p className="text-gray-700 dark:text-white/70 leading-relaxed">From the first consultation to the final delivery, we provide a stress-free, luxurious experience tailored to your needs.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-gray-50 dark:bg-dark-secondary py-24">
        <div className="max-w-[75rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-gold uppercase tracking-[0.2em] mb-4">The Visionaries</h2>
            <h3 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Meet Our Team</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Emmanuel O.", role: "Lead Photographer", img: "/images/groom.webp" },
              { name: "Sarah K.", role: "Creative Director", img: "/images/img_4744.webp" },
              { name: "Michael T.", role: "Lead Editor", img: "/images/men.webp" }
            ].map((member, i) => (
              <motion.div 
                key={i}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <div className="h-[400px] mb-6 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 group-hover:border-gold/40 group-hover:shadow-xl transition-all duration-300">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                </div>
                <h4 className="text-2xl font-display font-bold text-gray-900 dark:text-white text-center mb-2">{member.name}</h4>
                <p className="text-gold text-sm tracking-widest uppercase text-center">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
