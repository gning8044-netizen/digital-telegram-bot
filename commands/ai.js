const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Discuter avec Digital Crew AI',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🤖 **Digital Crew AI**\n\n' +
        'Pose ta question à mon intelligence artificielle.\n\n' +
        '**Utilisation :**\n' +
        '• `/ai Quelle est la capitale du Japon?`\n' +
        '• `/ai --deep Réfléchis en profondeur`\n' +
        '• `/ai --gpt5 Mode avancé`\n\n' +
        '✨ Généré par Alphaconnect\n© Digital Crew 243',
        { parse_mode: 'Markdown' }
      );
    }

    let model = 'default';
    let prompt = query;
    
    if (query.includes('--deep')) {
      model = 'think-deeper';
      prompt = query.replace('--deep', '').trim();
    } else if (query.includes('--gpt5')) {
      model = 'gpt-5';
      prompt = query.replace('--gpt5', '').trim();
    }

    const waitMsg = await bot.sendMessage(chatId, '🧠 Digital Crew AI réfléchit...');

    try {
      const response = await axios.get('https://kyotaka-api.vercel.app/', {
        params: { message: prompt, model: model },
        timeout: 45000
      });

      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

      if (response.data?.message) {
        await bot.sendMessage(
          chatId,
          `🤖 **Digital Crew AI**\n\n${response.data.message}\n\n✨ Généré par Alphaconnect\n© Digital Crew 243`,
          { parse_mode: 'Markdown' }
        );
      }

    } catch (error) {
      console.error('AI ERROR:', error.message);
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      bot.sendMessage(chatId, '❌ Erreur de connexion à Digital Crew AI. Réessaie dans quelques secondes.');
    }
  }
};