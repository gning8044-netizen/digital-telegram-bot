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

    const message = `📩 Nouveau message reçu :\n\n👤 De : ${userTag} (ID: ${user.id})\n\n🗣️ Message : ${prompt}`;
    await bot.sendMessage(adminId, message, { reply_markup: { force_reply: true } });
    await bot.sendMessage(chatId, '✅ Message envoyé à l’administrateur.');
  }
};

module.exports.replyHandler = async (bot, msg) => {
  const adminId = require.main.require('./index.js').adminChatId;
  if (msg.chat.id !== adminId || !msg.reply_to_message) return;

  const match = msg.reply_to_message.text.match(/ID:\s(\d+)/);
  if (!match) return;

  const targetId = match[1];
  await bot.sendMessage(targetId, `📬 Réponse de l’administrateur :\n\n${msg.text}`);
  await bot.sendMessage(adminId, '✅ Message envoyé à l’utilisateur.');
};