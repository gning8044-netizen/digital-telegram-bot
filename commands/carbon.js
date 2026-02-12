const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  name: 'carbon',
  description: 'Transformer du code en belle image',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    let code = '';

    if (msg.reply_to_message && msg.reply_to_message.text) {
      code = msg.reply_to_message.text;
    } else if (args.length > 0) {
      code = args.join(' ');
    } else {
      return bot.sendMessage(
        chatId,
        '✨ **Carbon Image Generator**\n\n' +
        'Transforme ton code en image stylisée.\n\n' +
        '**Utilisation :**\n' +
        '• Réponds à un message : `/carbon`\n' +
        '• Ou écris : `/carbon console.log("hello")`',
        { parse_mode: 'Markdown' }
      );
    }

    try {
      const statusMsg = await bot.sendMessage(
        chatId, 
        '🎨 Génération de l\'image Carbon...'
      );

      const response = await axios.post(
        'https://carbonara.solopov.dev/api/cook',
        { code: code },
        { 
          timeout: 15000,
          responseType: 'arraybuffer',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      await bot.deleteMessage(chatId, statusMsg.message_id).catch(() => {});

      await bot.sendPhoto(chatId, Buffer.from(response.data), {
        caption: `🖼️ **Carbon Generated**\n\n✨ Généré par Alphaconnect\n© Digital Crew 243`,
        parse_mode: 'Markdown'
      });

    } catch (error) {
      console.error('CARBON ERROR:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        return bot.sendMessage(chatId, '⏰ Délai d\'attente dépassé. Réessaie.');
      }
      
      bot.sendMessage(
        chatId,
        '❌ Erreur lors de la génération de l\'image.\n' +
        'Vérifie que le texte n\'est pas trop long.'
      );
    }
  }
};