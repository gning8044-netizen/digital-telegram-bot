const { adminChatId } = require('../index.js');

module.exports = {
  name: 'myid',
  description: 'Donne les infos de la personne à qui tu réponds (admin seulement)',
  async execute(bot, msg) {
    if (msg.from.id.toString() !== adminChatId.toString())
      return bot.sendMessage(msg.chat.id, '🚫 Accès refusé.');

    if (!msg.reply_to_message || !msg.reply_to_message.from) {
      return bot.sendMessage(msg.chat.id, 'ℹ️ Réponds à un message pour obtenir les infos de cette personne.');
    }

    const target = msg.reply_to_message.from;
    const name = `${target.first_name || ''} ${target.last_name || ''}`.trim() || 'Inconnu';
    const username = target.username ? `@${target.username}` : 'Aucun';
    const id = target.id;

    const message = `👤 *Informations de l'utilisateur :*\n\n📛 *Nom :* ${name}\n🔗 *Username :* ${username}\n🆔 *ID Telegram :* \`${id}\``;

    await bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
  }
};