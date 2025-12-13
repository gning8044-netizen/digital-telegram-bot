const axios = require('axios');

module.exports = {
  name: 'img',
  description: 'Rechercher et envoyer des images Google',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🖼️ Merci de fournir des mots-clés\nExemple : /img chats mignons'
      );
    }

    try {
      await bot.sendMessage(chatId, `🔍 Recherche d’images pour « ${query} »...`);

      const apiUrl =
        'https://apis.davidcyriltech.my.id/googleimage?query=' +
        encodeURIComponent(query);

      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data || !data.success || !Array.isArray(data.results) || data.results.length === 0) {
        return bot.sendMessage(chatId, '❌ Aucune image trouvée.');
      }

      // ⚠️ ICI LA CORRECTION IMPORTANTE
      const images = data.results
        .map(img => img.url) // ← on extrait la vraie URL
        .filter(Boolean)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      for (const imageUrl of images) {
        await bot.sendPhoto(chatId, imageUrl, {
          caption: `📷 Résultat pour : ${query}\n> © Digital Crew 243`
        });

        await new Promise(r => setTimeout(r, 800));
      }

    } catch (err) {
      console.error('IMG CMD ERROR:', err);
      bot.sendMessage(
        chatId,
        '❌ Erreur lors de la récupération des images.'
      );
    }
  }
};