const axios = require('axios');

module.exports = {
  name: 'img',
  description: 'Recherche des images sur Pexels et Unsplash',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    if (args.length === 0) {
      return bot.sendMessage(chatId, '❌ Utilisation : /img [mot-clé] [nombre d’images]');
    }

    const query = args[0];
    const count = parseInt(args[1]) || 5;
    const platform = args[2]?.toLowerCase() || 'pexels';

    const PEXELS_KEY = 'kwhDCyoJLqmjrOnOYnGNKfs7RsKQJzdig4cWVdlpHeY8Uq5iPFb6YJTK';
    const UNSPLASH_KEY = 'qo2n1JJGChcVwMzwvJLZzzjFjMQRg8g-5LthQY3y5I8';

    try {
      await bot.sendMessage(chatId, `🔍 Recherche de ${count} images pour *${query}* sur ${platform}...`, { parse_mode: 'Markdown' });

      let photos = [];
      
      if (platform === 'unsplash' || platform === 'u') {
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}`;
        const unsplashResponse = await axios.get(unsplashUrl, {
          headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
        });
        
        photos = unsplashResponse.data.results.map(photo => ({
          url: photo.urls.regular,
          sourceUrl: photo.links.html,
          photographer: photo.user.name
        }));
      } else {
        const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`;
        const pexelsResponse = await axios.get(pexelsUrl, {
          headers: { Authorization: PEXELS_KEY }
        });
        
        photos = pexelsResponse.data.photos.map(photo => ({
          url: photo.src.large,
          sourceUrl: photo.url,
          photographer: photo.photographer
        }));
      }

      if (!photos || photos.length === 0) {
        return bot.sendMessage(chatId, '⚠️ Aucune image trouvée.');
      }

      let sentCount = 0;
      for (const photo of photos) {
        try {
          await bot.sendPhoto(chatId, photo.url, {
            caption: `📸 ${photo.photographer ? `Par: ${photo.photographer}\n` : ''}[Voir la source](${photo.sourceUrl})`,
            parse_mode: 'Markdown'
          });
          sentCount++;
          if (sentCount >= count) break;
        } catch (photoErr) {
          continue;
        }
      }

      if (sentCount === 0) {
        await bot.sendMessage(chatId, '❌ Impossible d\'envoyer les images.');
      }

    } catch (err) {
      console.error('Erreur API image:', err.response?.data || err.message);
      bot.sendMessage(chatId, '❌ Erreur lors de la recherche d’images.');
    }
  }
};