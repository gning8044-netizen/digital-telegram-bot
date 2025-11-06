const fs = require('fs');

module.exports = {
  name: 'contact',
  description: 'Envoyer un message à l’administrateur',
  async execute(bot, msg) {
    const adminId = require.main.require('./index.js').adminChatId;
    const chatId = msg.chat.id;
    const user = msg.from;
    const userTag = user.username ? `@${user.username}` : `${user.first_name}`;
    const prompt = msg.text.split(' ').slice(1).join(' ');

    if (!prompt) {
      return bot.sendMessage(chatId, '✉️ Utilisation : /contact [votre message]');
    }

    const message = `📩 Nouveau message reçu :\n\n👤 De : ${userTag}\n\n🆔 ID : <pre>${user.id}</pre>\n\n🗣️ Message : ${prompt}`;
    await bot.sendMessage(adminId, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔎 Ouvrir le profil', url: `tg://user?id=${user.id}` }]
        ]
      }
    });
    await bot.sendMessage(chatId, '✅ Message envoyé à l’administrateur.');
  }
};