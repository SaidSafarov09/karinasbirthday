import React from 'react';
import { motion } from 'framer-motion';
import styles from './MinionDecoration.module.scss';

const MinionDecoration = () => {
  const minions = [
    // Top Section (Hero around) - Slightly moved to avoid text
    {
      url: "/Happy-Minions-PNG-Picture.png",
      className: styles.minion1,
      animate: { y: [0, -15, 0] }
    },
    {
      url: "/pngimg.com - minions_PNG83.png",
      className: styles.minion2,
      animate: { rotate: [-5, 5, -5] }
    },
    // Middle Segment (Transition Hero -> Info)
    {
      url: "/OEqlvr0GYbJEWWjEoidreFWaTvxj61ThLn4orwPC5mtdA6pXJZnUd2xhzozZMjjkqpgqQ7WE.png",
      className: styles.minion3,
      animate: { scale: [1, 1.03, 1] }
    },
    {
      url: "/pngimg.com - minions_PNG57.png",
      className: styles.minion4,
      animate: { y: [0, -20, 0] }
    },
    // Bottom Segment (Transition Info -> RSVP)
    {
      url: "/pngimg.com - minions_PNG61.png",
      className: styles.minion5,
      animate: { rotate: [-8, 8, -8] }
    },
    {
      url: "/pngimg.com - minions_PNG79.png",
      className: styles.minion6,
      animate: { y: [0, -15, 0] }
    }
  ];

  return (
    <div className={styles.minionLayer}>
      {minions.map((minion, i) => (
        <motion.img
          key={i}
          src={minion.url}
          alt="Minion Decoration"
          className={`${styles.minion} ${minion.className}`}
          animate={minion.animate}
          transition={{ 
            duration: 4 + i, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  );
};

export default MinionDecoration;
