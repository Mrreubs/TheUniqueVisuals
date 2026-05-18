import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/2348164877157"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
    >
      <span className="sr-only">Contact us on WhatsApp</span>
      <FaWhatsapp size={28} />
      
      {/* Pulse effect rings */}
      <span className="absolute w-full h-full rounded-full border-2 border-[#25D366] opacity-75 animate-ping" style={{ animationDuration: '2s' }}></span>
    </motion.a>
  );
}