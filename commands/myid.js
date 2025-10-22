module.exports = {
  name: 'myid',
  description: 'Renvoie ton ID Telegram',
  async execute(bot, msg) {
    try {
      const userId = msg.from.id;
      const firstName = msg.from.first_name || '';
      const lastName = msg.from.last_name || '';
      const username = msg.from.username ? `@${msg.from.username}` : `${firstName} ${lastName}`.trim() || 'Utilisateur';

      let response = `👤 *Votre ID Telegram* : \`${userId}\`\n`;
      response += `📛 *Nom* : ${username}\n`;
      
      if (msg.chat.type !== 'private') {
        response += `💬 *ID du chat* : \`${msg.chat.id}\``;
      }

      await bot.sendMessage(msg.chat.id, response, {
        parse_mode: 'Markdown',
        reply_to_message_id: msg.message_id
      });

    } catch (error) {
      console.error('Erreur myid:', error);
    }
  }
};