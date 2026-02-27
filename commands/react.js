const axios = require('axios');

module.exports = {
  name: 'react',
  description: 'Réagir à un post Telegram',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const reactions = ['👍', '❤️', '🔥', '🥰', '👏'];

    if (!args[0]) {
      return bot.sendMessage(
        chatId,
        '✨ **Réaction aux posts Telegram**\n\n' +
        'Permet de réagir à un message avec différents emojis.\n\n' +
        '**Utilisation :**\n' +
        '/react `lien_du_post`\n' +
        '/react `lien_du_post` 👍\n\n' +
        '**Réactions disponibles :**\n' +
        '👍 ❤️ 🔥 🥰 👏\n\n' +
        '**Exemples :**\n' +
        '/react https://t.me/c/1234567890/123\n' +
        '/react https://t.me/c/1234567890/123 🔥',
        { parse_mode: 'Markdown' }
      );
    }

    let messageId, channelId;
    const link = args[0];
    const reaction = args[1] || '👍';

    if (!reactions.includes(reaction)) {
      return bot.sendMessage(chatId, `❌ Réaction invalide. Choisis parmi : ${reactions.join(' ')}`);
    }

    try {
      const match = link.match(/t\.me\/c\/(\d+)\/(\d+)/);
      if (!match) {
        return bot.sendMessage(chatId, '❌ Lien invalide. Utilise un lien de post Telegram.');
      }

      channelId = -100 + match[1];
      messageId = parseInt(match[2]);

      const statusMsg = await bot.sendMessage(chatId, `⏳ Ajout de la réaction ${reaction}...`);

      await bot.setMessageReaction(channelId, messageId, {
        reaction: [{ type: 'emoji', emoji: reaction }]
      });

      await bot.deleteMessage(chatId, statusMsg.message_id);
      await bot.sendMessage(
        chatId, 
        `✅ Réaction ${reaction} ajoutée avec succès !\n\n🔗 Post : ${link}`,
        { parse_mode: 'Markdown' }
      );

    } catch (error) {
      console.error('REACT ERROR:', error.message);
      
      if (error.response && error.response.statusCode === 403) {
        return bot.sendMessage(chatId, '❌ Le bot n\'a pas les permissions nécessaires. Vérifie qu\'il est admin du canal.');
      }

      bot.sendMessage(
        chatId,
        '❌ Erreur lors de l\'ajout de la réaction.\n' +
        'Vérifie que le bot est admin du canal et que le lien est correct.'
      );
    }
  }
};