const axios = require('axios');

module.exports = {
  name: 'img',
  description: 'Recherche des images avec Bing Image Search API',
  async execute(bot, msg, args) {
    const BING_API_KEY = 'TA_CLE_API_ICI'; // ⚠️ Remplace par ta clé
    const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/images/search';

    if (!args.length) {
      return bot.sendMessage(msg.chat.id, '❌ Utilisation : /img [terme de recherche] [nombre]\nEx : /img voiture 3');
    }

    let count = 3;
    const lastArg = args[args.length - 1];
    if (!isNaN(parseInt(lastArg))) {
      count = Math.min(Math.max(parseInt(lastArg), 1), 10);
      args.pop();
    }

    const query = args.join(' ');
    await bot.sendMessage(msg.chat.id, `🔎 Recherche d’images pour : *${query}*...`, { parse_mode: 'Markdown' });

    try {
      const response = await axios.get(BING_ENDPOINT, {
        params: { q: query, count },
        headers: { 'Ocp-Apim-Subscription-Key': BING_API_KEY },
        timeout: 10000
      });

      const images = response.data.value;
      if (!images || images.length === 0) {
        return bot.sendMessage(msg.chat.id, '⚠️ Aucune image trouvée.');
      }

      const media = images.slice(0, count).map(img => ({
        type: 'photo',
        media: img.contentUrl
      }));

      if (media.length === 1) {
        await bot.sendPhoto(msg.chat.id, media[0].media, { caption: `🖼️ ${query}` });
      } else {
        await bot.sendMediaGroup(msg.chat.id, media);
      }
    } catch (err) {
      console.error('Erreur Bing Image:', err.response?.data || err.message);
      bot.sendMessage(msg.chat.id, '❌ Erreur lors de la recherche. Vérifie ta clé API Bing.');
    }
  }
};