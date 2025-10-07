"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showText ? (
        <motion.div
          key="whatsapp-text"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
        >
          <FaWhatsapp size={24} />
          <span className="font-medium"><a href="https://wa.me/923304462277" target="_blank" rel="noopener noreferrer">Contact on WhatsApp</a></span>
        </motion.div>
      ) : (
        <motion.a
          key="whatsapp-icon"
          href="https://wa.me/923304462277"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center z-50"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={28} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
