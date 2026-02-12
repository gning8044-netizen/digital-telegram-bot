const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Discuter avec l\'IA Kyotaka',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🤖 **IA Kyotaka**\n\n' +
        'Pose une question ou discute avec l\'IA.\n\n' +
        '**Utilisation :**\n' +
        '• `/ai Quelle est la capitale du Japon?`\n' +
        '• `/ai Explique la relativité`\n' +
        '• Répondre à un message avec `/ai`',
        { parse_mode: 'Markdown' }
      );
    }

    const waitMsg = await bot.sendMessage(chatId, '🤔 Je réfléchis...');

    try {
      // À TESTER - Essayez ces différentes URLs possibles
      const possibleUrls = [
        `https://kyotaka-api.vercel.app/api/chat?message=${encodeURIComponent(query)}`,
        `https://kyotaka-api.vercel.app/api/chat?text=${encodeURIComponent(query)}`,
        `https://kyotaka-api.vercel.app/api/chat?q=${encodeURIComponent(query)}`,
        `https://kyotaka-api.vercel.app/api/ai?message=${encodeURIComponent(query)}`
      ];

      let response = null;
      let successUrl = '';

      for (const url of possibleUrls) {
        try {
          response = await axios.get(url, { timeout: 15000 });
          if (response.data) {
            successUrl = url;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!response || !response.data) {
        throw new Error('Aucune réponse valide des endpoints testés');
      }

      // À ADAPTER - Formats de réponse possibles
      let reply = '';
      if (typeof response.data === 'string') {
        reply = response.data;
      } else if (response.data.response) {
        reply = response.data.response;
      } else if (response.data.message) {
        reply = response.data.message;
      } else if (response.data.answer) {
        reply = response.data.answer;
      } else if (response.data.text) {
        reply = response.data.text;
      } else {
        reply = JSON.stringify(response.data, null, 2);
      }

      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

      // Couper si trop long
      if (reply.length > 4000) {
        reply = reply.substring(0, 4000) + '... [tronqué]';
      }

      await bot.sendMessage(
        chatId,
        `🤖 **Kyotaka AI**\n\n${reply}\n\n✨ Généré par Alphaconnect\n© Digital Crew 243`,
        { parse_mode: 'Markdown' }
      );

    } catch (error) {
      console.error('AI ERROR:', error.message);
      
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      
      bot.sendMessage(
        chatId,
        '❌ Impossible de contacter l\'API Kyotaka.\n\n' +
        'Vérifie que :\n' +
        '• L\'URL est correcte (https://kyotaka-api.vercel.app)\n' +
        '• Le endpoint est bien /api/chat.js ou /api/chat\n' +
        '• La méthode (GET/POST) est bonne\n\n' +
        '🔍 Tu peux tester dans ton navigateur :\n' +
        '`https://kyotaka-api.vercel.app/api/chat?message=test`'
      );
    }
  }
};