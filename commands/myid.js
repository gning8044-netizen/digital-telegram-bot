const { adminChatId } = require('../index.js');

module.exports = {
  name: 'myid',
  description: 'Récupère l’ID et infos d’un utilisateur (admin, reply seulement)',
  async execute(bot, msg) {
    if (msg.from.id.toString() !== adminChatId.toString())
      return bot.sendMessage(msg.chat.id, '🚫 Accès refusé.');

    if (!msg.reply_to_message) {
      return bot.sendMessage(msg.chat.id, 'ℹ️ Utilisation : réponds au message de la personne puis tape /myid');
    }

    const target = msg.reply_to_message.from;
    const id = target.id;
    const username = target.username ? `@${target.username}` : 'Aucun';
    const name = `${target.first_name || ''} ${target.last_name || ''}`.trim() || 'Inconnu';

    await bot.sendMessage(
      msg.chat.id,
      `👤 Infos utilisateur :\nNom : ${name}\nUsername : ${username}\nID : \`${id}\``,
      { parse_mode: 'Markdown' }
    );
  }
};