const axios = require('axios');

module.exports = {
  name: 'img',
  description: 'Rechercher et envoyer des images Pinterest',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🖼️ Fournis des mots-clés\nExemple : /img paysage'
      );
    }

    try {
      await bot.sendMessage(chatId, `🔍 Recherche « ${query} »...`);

      const apiUrl = `https://christus-api.vercel.app/image/Pinterest?search=${encodeURIComponent(query)}`;
      
      const response = await axios.get(apiUrl, { timeout: 15000 });

      if (!response.data || !response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
        return bot.sendMessage(chatId, '❌ Aucune image trouvée pour cette recherche.');
      }

      const images = response.data.data
        .filter(item => item.url && (item.url.includes('.jpg') || item.url.includes('.jpeg') || item.url.includes('.png') || item.url.includes('.webp')))
        .map(item => item.url)
        .slice(0, 10);

      if (images.length === 0) {
        return bot.sendMessage(chatId, '❌ Aucune URL d\'image valide.');
      }

      const imagesToSend = images.slice(0, 5);

      for (const imageUrl of imagesToSend) {
        try {
          await bot.sendPhoto(chatId, imageUrl, {
            caption: `📷 ${query}\n© Digital Crew`
          });
          await new Promise(r => setTimeout(r, 1200));
        } catch (photoError) {
          console.log(`Image invalide: ${imageUrl}`);
          continue;
        }
      }

    } catch (error) {
      console.error('IMG ERROR:', error.message);
      
      try {
        const fallbackApi = `https://candaan-api.vercel.app/api/pinterest?query=${encodeURIComponent(query)}`;
        const fallbackResponse = await axios.get(fallbackApi, { timeout: 10000 });
        
        if (fallbackResponse.data && fallbackResponse.data.result && Array.isArray(fallbackResponse.data.result)) {
          const fallbackImages = fallbackResponse.data.result.slice(0, 3);
          
          for (const img of fallbackImages) {
            if (img && img.includes('http')) {
              await bot.sendPhoto(chatId, img, {
                caption: `📷 ${query}\n© Digital Crew`
              });
              await new Promise(r => setTimeout(r, 1000));
            }
          }
        } else {
          bot.sendMessage(chatId, '❌ Service temporairement indisponible.');
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError.message);
        bot.sendMessage(chatId, '❌ Erreur de recherche d\'images.');
      }
    }
  }
};