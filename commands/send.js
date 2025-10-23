module.exports = {
  name: 'send',
  description: 'Envoyer un message à un utilisateur via son ID',
  async execute(bot, msg) {
    const adminId = require.main.require('./index.js').adminChatId;
    const chatId = msg.chat.id;
    if (chatId.toString() !== adminId.toString()) return bot.sendMessage(chatId, '🚫 Accès refusé.');

    const args = msg.text.split(' ').slice(1);
    const targetId = args[0];
    const message = args.slice(1).join(' ');

    if (!targetId || !message) {
      return bot.sendMessage(chatId, '✉️ Utilisation : /send [user_id] [message]');
    }

    try {
      await bot.sendMessage(targetId, `📨 Message de l’administrateur :\n\n${message}`);
      await bot.sendMessage(chatId, '✅ Message envoyé avec succès.');
    } catch {
      await bot.sendMessage(chatId, '⚠️ Échec de l’envoi du message.');
    }
  }
};