import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, XCircle, Utensils, Wine, ExternalLink, ShoppingBag, Banknote, UserCheck, Trash2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../../supabaseClient';
import { sendToTelegram } from '../../telegram';
import { WISHLIST_ITEMS } from '../../data/wishlistItems';
import styles from './RSVP.module.scss';
import MinionDecoration from '../MinionDecoration/MinionDecoration';

// Sub-component for individual Wishlist Item
const WishlistItem = ({ item, booking, userId, onReserve, onCancel }) => {
  const [isReserving, setIsReserving] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [name, setName] = useState('');

  const ItemIcon = item.icon || ShoppingBag;
  const isMine = booking && booking.user_id === userId;
  const isReserved = booking && !isMine;

  const handleStartReserve = () => setIsReserving(true);

  const handleFinalReserve = () => {
    if (!name.trim()) {
      alert('Пожалуйста, введи своё имя');
      return;
    }
    onReserve(item.name, name.trim());
    setIsReserving(false);
  };

  return (
    <div className={styles.wishlistItem}>
      <div className={styles.wishlistTop}>
        <div className={styles.wishlistThumb}><ItemIcon size={18} /></div>
        <div className={styles.wishlistText}>
          <h4>{item.name}</h4>
          <span className={styles.wishlistPrice}>~{item.price}</span>
        </div>
      </div>

      {item.description && <p className={styles.itemDescription}>{item.description}</p>}

      <div className={`${styles.wishlistActions} ${(isReserving || isConfirmingCancel) ? styles.isConfirming : ''}`}>
        {!isReserving && !isConfirmingCancel ? (
          <>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className={`${styles.actionBtn} ${styles.storeBtn}`}
            >
              В магазин <ExternalLink size={14} />
            </a>

            {isReserved ? (
              <div className={styles.occupiedWrapper}>
                <button disabled className={`${styles.actionBtn} ${styles.occupiedBtn}`}>
                  Подарок занят
                </button>
              </div>
            ) : isMine ? (
              <button
                onClick={() => setIsConfirmingCancel(true)}
                className={`${styles.actionBtn} ${styles.cancelBtn}`}
              >
                Отменить бронь
              </button>
            ) : (
              <button
                onClick={handleStartReserve}
                className={`${styles.actionBtn} ${styles.reserveBtn}`}
              >
                Забронировать
              </button>
            )}
          </>
        ) : isReserving ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.nameInputContainer}
          >
            <p>Запиши своё имя, чтобы закрепить выбранный подарок за собой 🙃</p>
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Твоё имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <div className={styles.confirmActions}>
                <button className={styles.confirmYes} onClick={handleFinalReserve}>Забронировать</button>
                <button className={styles.confirmNo} onClick={() => setIsReserving(false)}>Отмена</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.confirmOverlay}
          >
            <p>Отменить бронь подарка?<br />
              Он станет доступен для бронирования другим</p>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmYes}
                onClick={() => { onCancel(item.name); setIsConfirmingCancel(false); }}
              >
                Да, отменить
              </button>
              <button
                className={styles.confirmNo}
                onClick={() => setIsConfirmingCancel(false)}
              >
                Нет, я передумал
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const RSVP = () => {
  const [formData, setFormData] = useState({
    coming: 'yes',
    food: '',
    drink: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [userId] = useState(() => {
    const saved = localStorage.getItem('wishlist_user_id');
    if (saved) return saved;
    const newId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
    localStorage.setItem('wishlist_user_id', newId);
    return newId;
  });

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();

    // Live updates
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) console.error('Fetch error:', error);
    else setBookings(data || []);
  };

  const handleReserve = async (itemName, userName) => {
    const { error } = await supabase
      .from('bookings')
      .insert({ item_name: itemName, user_id: userId, user_name: userName });

    if (error) {
      if (error.code === '23505') alert('Ой, кто-то только что успел забронировать этот подарок быстрее!');
      else alert('Ошибка при бронировании. Попробуйте снова.');
    }
    fetchBookings();
  };

  const handleCancelReservation = async (itemName) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('item_name', itemName)
      .eq('user_id', userId);

    if (error) alert('Не удалось отменить бронь.');
    fetchBookings();
  };

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
    <section className={styles.rsvpSection} id="rsvp" style={{ position: 'relative' }}>
      <MinionDecoration minionIds={[6]} />
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
                <p>Ждем тебя на празднике!</p>
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
                <div className={styles.giftMessage} style={{ position: 'relative' }}>
                  <MinionDecoration minionIds={[4]} />
                  <div className={styles.giftIcon}><Banknote size={20} /></div>
                  <div className={styles.giftText}>
                    <h3>Пожелания по подарку</h3>
                    <p>Буду рада любому денежному вкладу на будущие мечты 💸</p>
                    <p className={styles.muted}>А если хочешь подарить что-то конкретное — загляни в мой вишлист ниже:</p>
                  </div>
                </div>

                <div className={styles.wishlistGrid}>
                  {WISHLIST_ITEMS.map((item, idx) => {
                    const booking = bookings.find(b => b.item_name === item.name);
                    return (
                      <WishlistItem
                        key={idx}
                        item={item}
                        booking={booking}
                        userId={userId}
                        onReserve={handleReserve}
                        onCancel={handleCancelReservation}
                      />
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
