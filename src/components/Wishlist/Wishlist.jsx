import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag, Stars } from 'lucide-react';
import styles from './Wishlist.module.scss';

const Wishlist = () => {
  const items = [
    {
      name: "LEGO Star Wars",
      description: "Очень хочу собрать этот набор!",
      link: "https://www.lego.com",
      price: "5990₽"
    },
    {
      name: "Настольная игра 'Неудержимые единорожки'",
      description: "Будем играть все вместе!",
      link: "https://www.hobbyworld.ru",
      price: "1990₽"
    },
    {
      name: "Подарочный сертификат OZON",
      description: "Всегда пригодится для мелочей",
      link: "https://www.ozon.ru",
      price: "Любая сумма"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.wishlistSection}
    >
      <div className="container">
        <div className={styles.header}>
          <Stars size={32} className={styles.icon} />
          <h2 className={styles.title}>Мой виш-лист</h2>
        </div>
        <p className={styles.subtitle}>Если хочешь подарить что-то конкретное:</p>
        
        <div className={styles.grid}>
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={styles.itemCard}
            >
              <div className={styles.itemHeader}>
                <div className={styles.itemIcon}><ShoppingBag size={24} /></div>
                <div className={styles.priceTag}>{item.price}</div>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className={styles.footer}>
                <a href={item.link} target="_blank" rel="noreferrer" className={styles.link}>
                  <span>Посмотреть</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Wishlist;
