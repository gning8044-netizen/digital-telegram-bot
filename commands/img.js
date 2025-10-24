const axios = require('axios');

module.exports = {
  name: 'generate',
  description: 'Génère une image avec AI',
  async execute(bot, msg, args) {
    try {
      if (!args.length) {
        await bot.sendMessage(msg.chat.id, '❌ *Utilisation:* `/generate [description de l\\'image]`\nExemple: `/generate un chat astronaut dans l\\'espace`', {
          parse_mode: 'Markdown'
        });
        return;
      }

      const prompt = args.join(' ');
      
      await bot.sendMessage(msg.chat.id, '🔄 *Génération de l\\'image en cours...*', {
        parse_mode: 'Markdown',
        reply_to_message_id: msg.message_id
      });

      const API_KEY = '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';

      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const imageUrl = response.data.data[0].url;

      await bot.sendPhoto(msg.chat.id, imageUrl, {
        caption: `🎨 *Image générée:*\n"${prompt}"\n\n📸 *DALL-E 3*`,
        parse_mode: 'Markdown'
      });

    } catch (error) {
      console.error('Erreur generation:', error);
      
      let errorMessage = '❌ Erreur lors de la génération de l\'image';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = '❌ Timeout - La génération prend trop de temps';
      } else if (error.response?.status === 401) {
        errorMessage = '❌ Clé API invalide ou expirée';
      } else if (error.response?.status === 429) {
        errorMessage = '❌ Limite de requêtes API dépassée';
      } else if (error.response?.status === 400) {
        errorMessage = '❌ Prompt rejeté (contenu inapproprié)';
      } else if (error.response?.data?.error?.message) {
        errorMessage = `❌ ${error.response.data.error.message}`;
      }

      await bot.sendMessage(msg.chat.id, errorMessage);
    }
  }
};