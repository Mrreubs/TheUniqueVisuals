import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNotification } from '../contexts/NotificationContext';
import { sendContactNotification } from '../services/emailService';

const INITIAL_FORM = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        type: 'contact',
        createdAt: serverTimestamp(),
      });
      sendContactNotification(formData);
      setFormData(INITIAL_FORM);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      addNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-dark text-gray-900 dark:text-white min-h-screen pt-24 pb-16">
      <div className="max-w-[75rem] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">
            Get in <span className="font-semibold text-gold">Touch</span>
          </h1>
          <p className="text-gray-700 dark:text-white/70 max-w-2xl mx-auto text-lg md:text-xl font-light">
            We would love to hear from you. Whether you have a question about our services, pricing, or want to book a
            session, we are here to help.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="w-full lg:w-1/3 space-y-12"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-8">Contact Information</h3>
              <div className="space-y-6">
                <a href="mailto:Theuniquevisuals15@gmail.com" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-white/50 mb-1">Email Us</p>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-gold transition-colors duration-300">
                      Theuniquevisuals15@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/2348164877157"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gold group-hover:bg-[#25D366] group-hover:text-white transition-colors duration-300">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-white/50 mb-1">WhatsApp</p>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-[#25D366] transition-colors duration-300">
                      +234 816 487 7157
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gold">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-white/50 mb-1">Call Us</p>
                    <p className="font-medium text-gray-900 dark:text-white">+234 816 487 7157</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gold">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-white/50 mb-1">Studio Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">7, Abese Estate, Elebu, Ibadan</p>
                    <p className="text-sm text-gray-600 dark:text-white/50 mt-1">Oyo State, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="w-full lg:w-2/3"
          >
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-8">Send a Message</h3>

              {isSubmitted ? (
                <div className="bg-gold/20 border border-gold text-gray-900 dark:text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-2">
                    <Send size={24} className="text-white" />
                  </div>
                  <h4 className="text-xl font-medium">Message Sent Successfully!</h4>
                  <p className="text-gray-600 dark:text-white/60">
                    Thank you for reaching out. We will get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 pb-2 text-gray-900 dark:text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 pb-2 text-gray-900 dark:text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 pb-2 text-gray-900 dark:text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 pb-2 text-gray-900 dark:text-white focus:border-gold focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project or inquiry..."
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gold hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 rounded-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-gray-900 disabled:dark:hover:bg-white disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
