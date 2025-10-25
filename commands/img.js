const axios = require('axios');

module.exports = {
  name: 'img',
  description: 'Recherche des images sur Pexels',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    if (args.length === 0) {
      return bot.sendMessage(chatId, '❌ Utilisation : /img [mot-clé] [nombre d’images]');
    }

    const query = args[0];
    const count = parseInt(args[1]) || 3;

    const API_KEY = 'kwhDCyoJLqmjrOnOYnGNKfs7RsKQJzdig4cWVdlpHeY8Uq5iPFb6YJTK'; // ⚠️ Mets ta clé ici
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`;

    try {
      await bot.sendMessage(chatId, `🔍 Recherche d’images pour *${query}*...`, { parse_mode: 'Markdown' });

      const response = await axios.get(url, {
        headers: { Authorization: API_KEY }
      });

      const photos = response.data.photos;
      if (!photos || photos.length === 0) {
        return bot.sendMessage(chatId, '⚠️ Aucune image trouvée.');
      }

      for (const photo of photos) {
        await bot.sendPhoto(chatId, photo.src.medium, {
          caption: `📸 [Voir sur Pexels](${photo.url})`,
          parse_mode: 'Markdown'
        });
      }
    } catch (err) {
      console.error('Erreur Pexels:', err.response?.data || err.message);
      bot.sendMessage(chatId, '❌ Erreur lors de la recherche d’images.');
    }
  }
};