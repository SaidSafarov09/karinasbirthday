import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Heart, Copy, Check } from 'lucide-react';
import styles from './Footer.module.scss';

const Footer = ({ name }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('name', name);
    navigator.clipboard.writeText(url.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer className={styles.footerSection}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.heartWrapper}>
            <motion.div 
               animate={{ scale: [1, 1.3, 1] }} 
               transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart size={40} fill="#FF4D8D" color="#FF4D8D" />
            </motion.div>
          </div>
          
          <h2 className={styles.title}>Жду тебя на празднике!</h2>
          <p className={styles.tagline}>Сделано с любовью для самых крутых друзей</p>
          
          <motion.button 
            className={styles.shareButton} 
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div 
                   key="copied" 
                   initial={{ opacity: 0, scale: 0.5 }} 
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.5 }}
                   className={styles.shareText}
                >
                  <Check size={20} /> Ссылка скопирована!
                </motion.div>
              ) : (
                <motion.div 
                   key="share" 
                   initial={{ opacity: 0, scale: 0.5 }} 
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.5 }}
                   className={styles.shareText}
                >
                  <Share2 size={20} /> Поделиться приглашением
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
