const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'generate',
  description: 'Générer une image IA avec Magic Studio',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const prompt = args.join(' ');

    if (!prompt) {
      return bot.sendMessage(
        chatId,
        '🎨 **Générateur d\'images IA**\n\n' +
        'Transforme ta description en image.\n\n' +
        '**Utilisation :**\n' +
        '• `/generate un chat cyberpunk`\n' +
        '• `/generate paysage fantasy`\n' +
        '• `/generate portrait robot futuriste`',
        { parse_mode: 'Markdown' }
      );
    }

    const waitMessage = await bot.sendMessage(
      chatId,
      `⏳ Génération de l'image pour :\n« ${prompt} »\n\nCela peut prendre 20-40 secondes...`
    );

    const startTime = Date.now();

    try {
      const formData = new URLSearchParams();
      formData.append('prompt', prompt);
      formData.append('output_format', 'bytes');
      formData.append('request_timestamp', Math.floor(Date.now() / 1000).toString());
      formData.append('user_is_subscribed', 'false');

      const response = await axios.post(
        'https://ai-api.magicstudio.com/api/ai-art-generator',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          responseType: 'arraybuffer',
          timeout: 60000
        }
      );

      if (response.status === 200 && response.data) {
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);
        
        await bot.deleteMessage(chatId, waitMessage.message_id).catch(() => {});
        
        await bot.sendPhoto(chatId, Buffer.from(response.data), {
          caption: `🖼️ **${prompt}**\n\n⏱️ Généré en ${timeTaken}s\n\n✨ Généré par Alphaconnect\n© Digital Crew 243`,
          parse_mode: 'Markdown'
        });
      } else {
        await bot.editMessageText(
          chatId,
          waitMessage.message_id,
          '❌ Échec de la génération de l\'image.'
        );
      }

    } catch (error) {
      console.error('GENERATE ERROR:', error.message);
      
      let errorMessage = '❌ Erreur lors de la génération de l\'image.\n';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = '⏰ Délai de génération dépassé. Réessaie avec une description plus simple.';
      } else if (error.response?.status === 429) {
        errorMessage = '⚠️ Trop de requêtes. Attends quelques secondes.';
      } else if (error.response?.status === 503) {
        errorMessage = '🔧 Service temporairement indisponible. Réessaie plus tard.';
      } else {
        errorMessage += 'Réessaie avec une autre description.';
      }
      
      await bot.editMessageText(chatId, waitMessage.message_id, errorMessage).catch(() => {
        bot.sendMessage(chatId, errorMessage);
      });
    }
  }
};