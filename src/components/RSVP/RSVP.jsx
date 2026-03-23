import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, XCircle, Utensils, Wine, Stars, ExternalLink, ShoppingBag, Banknote, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendToTelegram } from '../../telegram';
import { WISHLIST_ITEMS } from '../../data/wishlistItems';
import styles from './RSVP.module.scss';

const RSVP = () => {
  const [formData, setFormData] = useState({
    coming: 'yes',
    food: '',
    drink: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `
🌟 <b>Новый ответ на приглашение!</b>

<b>Гость:</b> ${new URLSearchParams(window.location.search).get('name') || 'Аноним'}
<b>Придет:</b> ${formData.coming === 'yes' ? '✅ Придет' : '❌ Не придет'}
<b>Еда:</b> ${formData.food || 'не указано'}
<b>Напитки:</b> ${formData.drink || 'не указано'}
    `;

    const success = await sendToTelegram(message);

    if (success) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FB923C', '#0EA5E9', '#FB7185', '#FDE047']
      });
      setIsSent(true);
    } else {
      alert('Ошибка при отправке! Попробуйте еще раз.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.rsvpSection} id="rsvp">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.card}
        >
          <div className={styles.header}>
            <UserCheck size={20} className={styles.icon} />
            <h2 className={styles.title}>Подтверждение</h2>
          </div>

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className={styles.form}
              >
                <div className={styles.formGroup}>
                  <label>Сможешь прийти?</label>
                  <div className={styles.optionGrid}>
                    <div
                      className={`${styles.option} ${formData.coming === 'yes' ? styles.active : ''}`}
                      onClick={() => setFormData({ ...formData, coming: 'yes' })}
                    >
                      <CheckCircle2 size={24} />
                      <span>Приду!</span>
                    </div>
                    <div
                      className={`${styles.option} ${formData.coming === 'no' ? styles.active : ''}`}
                      onClick={() => setFormData({ ...formData, coming: 'no' })}
                    >
                      <XCircle size={24} />
                      <span>Не смогу</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {formData.coming === 'yes' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className={styles.row}>
                        <div className={styles.formGroup}>
                          <label>Предпочтения в еде</label>
                          <div className={styles.inputWrapper}>
                            <Utensils size={18} className={styles.inputIcon} />
                            <input
                              type="text"
                              placeholder="Что хочешь есть?"
                              value={formData.food}
                              onChange={(e) => setFormData({ ...formData, food: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Предпочтения в напитках</label>
                          <div className={styles.inputWrapper}>
                            <Wine size={18} className={styles.inputIcon} />
                            <input
                              type="text"
                              placeholder="Что хочешь пить?"
                              value={formData.drink}
                              onChange={(e) => setFormData({ ...formData, drink: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isSubmitting}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? 'Отправляем...' : 'Готово'}
                        {!isSubmitting && <Send size={18} />}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {formData.coming === 'no' && (
                  <motion.button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.98 }}
                    style={{ marginTop: '24px' }}
                  >
                    {isSubmitting ? 'Отправляем...' : 'Отправить'}
                    {!isSubmitting && <Send size={18} />}
                  </motion.button>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.successMessage}
              >
                <div className={styles.successIcon}><CheckCircle2 size={48} /></div>
                <h2>Твой ответ отправлен!</h2>
                <p>Жду тебя на празднике 🥰</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {formData.coming === 'yes' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.wishlistContainer}
              >
                <div className={styles.giftMessage}>
                  <div className={styles.giftIcon}><Banknote size={20} /></div>
                  <div className={styles.giftText}>
                    <h3>Пожелания по подарку</h3>
                    <p>Буду рада любому денежному вкладу на будущие мечты 💸</p>
                    <p className={styles.muted}>А если хочешь подарить что-то конкретное — загляни в мой вишлист ниже:</p>
                  </div>
                </div>

                <div className={styles.wishlistGrid}>
                  {WISHLIST_ITEMS.map((item, idx) => {
                    const ItemIcon = item.icon || ShoppingBag;
                    return (
                      <a
                        key={idx}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.wishlistItem}
                      >
                        <div className={styles.wishlistThumb}><ItemIcon size={18} /></div>
                        <div className={styles.wishlistText}>
                          <h4>{item.name}</h4>
                          <p>{item.description}</p>
                          <span className={styles.wishlistPrice}>~{item.price}</span>
                        </div>
                        <ExternalLink size={14} className={styles.externalIcon} />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default RSVP;
