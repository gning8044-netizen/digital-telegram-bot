const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'generate',
  description: 'Générer une image IA',

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
        '• `/generate paysage fantasy`',
        { parse_mode: 'Markdown' }
      );
    }

    const waitMessage = await bot.sendMessage(
      chatId,
      `⏳ Génération de l'image pour :\n« ${prompt} »\n\nCela peut prendre 20-40 secondes...`
    );

    const startTime = Date.now();

    try {
      const response = await axios.post(
        'https://ai-api.magicstudio.com/api/ai-art-generator',
        {
          prompt: prompt,
          output_format: 'bytes',
          request_timestamp: Math.floor(Date.now() / 1000).toString(),
          user_is_subscribed: 'false'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Origin': 'https://magicstudio.com',
            'Referer': 'https://magicstudio.com/ai-art-generator/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty'
          },
          responseType: 'arraybuffer',
          timeout: 90000
        }
      );

      if (response.status === 200 && response.data && response.data.length > 1000) {
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
          '❌ Échec de la génération de l\'image (réponse vide).'
        );
      }

    } catch (error) {
      console.error('GENERATE ERROR:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data?.toString()?.slice(0, 200)
      });

      let errorMessage = '❌ Erreur lors de la génération.\n';

      if (error.code === 'ECONNABORTED') {
        errorMessage = '⏰ Délai dépassé (90s). Réessaie plus tard.';
      } else if (error.response?.status === 403) {
        errorMessage = '🔒 Accès refusé par Magic Studio. API peut-être devenue payante.';
      } else if (error.response?.status === 429) {
        errorMessage = '⚠️ Trop de requêtes. Attends 30 secondes.';
      } else {
        errorMessage += 'API Magic Studio peut être hors service.';
      }

      await bot.editMessageText(chatId, waitMessage.message_id, errorMessage).catch(() => {
        bot.sendMessage(chatId, errorMessage);
      });
    }
  }
};