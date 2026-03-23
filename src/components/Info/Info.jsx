import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, Info as InfoIcon } from 'lucide-react';
import styles from './Info.module.scss';
import MinionDecoration from '../MinionDecoration/MinionDecoration';

const Info = () => {
  return (
    <section className={styles.infoSection} id="info" style={{ position: 'relative' }}>
      <MinionDecoration minionIds={[3, 5]} />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={styles.card}
        >
          <div className={styles.header}>
            <InfoIcon size={20} className={styles.icon} />
            <h2 className={styles.title}>Локация</h2>
          </div>

          <div className={styles.grid}>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}><Calendar size={20} /></div>
              <h3>4 апреля</h3>
              <p>Субботний вечер</p>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}><Clock size={20} /></div>
              <h3>19:00</h3>
              <p>Встреча гостей</p>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}><MapPin size={20} /></div>
              <h3>Ярдем, 25</h3>
              <p>кв. 150, подъезд 4</p>
            </div>
          </div>

          <div className={styles.mapContainer}>
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=49.150261,55.738708&z=17&pt=49.150261,55.738708,pm2rdm"
              width="100%"
              height="300"
              frameBorder="0"
              allowFullScreen={true}
              title="Yandex Map"
            ></iframe>
          </div>

          <motion.a
            href="https://yandex.ru/maps/?rtext=~55.738708,49.150261&rtt=auto"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            className={styles.routeButton}
          >
            <Navigation size={18} />
            Проложить путь
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Info;
