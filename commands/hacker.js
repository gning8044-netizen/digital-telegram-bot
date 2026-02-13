const axios = require('axios');

module.exports = {
  name: 'hacker',
  description: 'Générer une image style hacker avec ton texte',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const text = args.join(' ');

    if (!text) {
      return bot.sendMessage(
        chatId,
        '💻 **Générateur d\'image Hacker**\n\n' +
        'Crée une image style matrix/hacker avec ton texte.\n\n' +
        '**Utilisation :**\n' +
        '• `/hacker Digital Crew 243`\n' +
        '• `/hacker Alphaconnect`\n' +
        '• `/hacker Cyberpunk 2077`\n\n' +
        '✨ Généré par Alphaconnect\n© Digital Crew 243',
        { parse_mode: 'Markdown' }
      );
    }

    const waitMsg = await bot.sendMessage(chatId, '💻 Génération de l\'image hacker...');

    try {
      const response = await axios.get('https://kyotaka-api.vercel.app/api/hacker', {
        params: { text: text },
        responseType: 'arraybuffer',
        timeout: 30000
      });

      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

      await bot.sendPhoto(chatId, Buffer.from(response.data), {
        caption: `💻 **Hacker Style**\n\n📝 \`${text}\`\n\n✨ Généré par Alphaconnect\n© Digital Crew 243`,
        parse_mode: 'Markdown'
      });

    } catch (error) {
      console.error('HACKER ERROR:', error.message);
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      
      if (error.response?.status === 400) {
        bot.sendMessage(chatId, '❌ Texte manquant. Utilise `/hacker ton texte`');
      } else if (error.code === 'ECONNABORTED') {
        bot.sendMessage(chatId, '⏰ Délai d\'attente dépassé. Réessaie.');
      } else {
        bot.sendMessage(chatId, '❌ Erreur lors de la génération de l\'image. Réessaie plus tard.');
      }
    }
  }
};