import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './MinionDecoration.module.scss';

const MINION_CONFIGS = {
  1: {
    url: "/Happy-Minions-PNG-Picture.png",
    className: styles.minion1,
    animate: { y: [0, -15, 0] }
  },
  2: {
    url: "/pngimg.com - minions_PNG83.png",
    className: styles.minion2,
    animate: { rotate: [-5, 5, -5] }
  },
  3: {
    url: "/OEqlvr0GYbJEWWjEoidreFWaTvxj61ThLn4orwPC5mtdA6pXJZnUd2xhzozZMjjkqpgqQ7WE.png",
    className: styles.minion3,
    animate: { scale: [1, 1.03, 1] }
  },
  4: {
    url: "/pngimg.com - minions_PNG57.png",
    className: styles.minion4,
    animate: { y: [0, -20, 0] }
  },
  5: {
    url: "/pngimg.com - minions_PNG61.png",
    className: styles.minion5,
    animate: { rotate: [-8, 8, -8] }
  },
  6: {
    url: "/pngimg.com - minions_PNG79.png",
    className: styles.minion6,
    animate: { y: [0, -15, 0] }
  }
};

const MinionDecoration = ({ minionIds = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {minionIds.map((id) => {
        const minion = MINION_CONFIGS[id];
        if (!minion) return null;

        return (
          <motion.img
            key={id}
            src={minion.url}
            alt="Minion Decoration"
            className={`${styles.minion} ${minion.className}`}
            // Выключаем анимации на мобилках для FPS
            animate={isMobile ? {} : minion.animate}
            loading="lazy"
            transition={{ 
              duration: 4 + id, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: id * 0.3
            }}
          />
        );
      })}
    </>
  );
};

export default MinionDecoration;
