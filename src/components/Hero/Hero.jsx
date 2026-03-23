import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';
import styles from './Hero.module.scss';
import MinionDecoration from '../MinionDecoration/MinionDecoration';

const Hero = ({ name }) => {
  return (
    <section className={styles.heroSection} style={{ position: 'relative' }}>
      <MinionDecoration minionIds={[1, 2]} />
      <div className={styles.heroContainer}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={styles.heroContent}
        >
          <div className={styles.labelWrapper}>
            <Sparkles size={16} className={styles.icon} />
            <span className={styles.label}>ПРИГЛАШЕНИЕ</span>
          </div>

          <h1 className={styles.title}>
            Привет, <br />
            <span className={styles.nameHighlight}>
              {name}
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1 }}
                className={styles.underline}
              />
            </span>!
          </h1>

          <div className={styles.details}>
            <h2 className={styles.subtitle}>
              Приглашаю тебя на мой день рождения
            </h2>
            <p className={styles.tagline}>
              Это будет по-особенному тепло и незабываемо
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className={styles.scrollIndicator}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className={styles.scrollText}>ЛИСТАЙ НИЖЕ</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={styles.scrollIcon}
            >
              <ArrowDown size={20} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Premium Mesh */}
      <div className={styles.meshGradient}></div>
      <div className={styles.ambientGlow1}></div>
      <div className={styles.ambientGlow2}></div>
    </section>
  );
};

export default Hero;
