export const TELEGRAM_CONFIG = {
  BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID,
};

export const sendToTelegram = async (message) => {
  if (!TELEGRAM_CONFIG.BOT_TOKEN) {
    console.warn('Telegram BOT_TOKEN is missing. Check your .env file or Vercel environment variables.');
    return true; 
  }
  
  // Clean message for better text delivery
  const cleanMessage = message.replace(/<b>/g, '').replace(/<\/b>/g, '').trim();

  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: cleanMessage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
    }
    
    return response.ok;
  } catch (err) {
    console.error('Network error during Telegram send:', err);
    return false;
  }
};
