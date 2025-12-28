const { adminChatId } = require('../index.js');

module.exports = {
  name: 'leave',
  description: 'Fait quitter le bot du groupe actuel',
  async execute(bot, msg) {
    if (msg.from.id.toString() !== adminChatId.toString()) {
      return bot.sendMessage(msg.chat.id, '🚫 Accès refusé.');
    }

    if (msg.chat.type === 'private') {
      return bot.sendMessage(msg.chat.id, '⚠️ Cette commande ne fonctionne que dans les groupes.');
    }

    await bot.sendMessage(msg.chat.id, '👋 Adieu ! Le bot quitte ce groupe.');
    await bot.leaveChat(msg.chat.id);
  }
};