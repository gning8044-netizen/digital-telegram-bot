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
        '🖼️ Merci de fournir des mots-clés pour la recherche\nExemple : /img chats mignons'
      );
    }

    try {
      await bot.sendMessage(chatId, `🔍 Recherche d’images pour « ${query} »...`);

      const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
      const response = await axios.get(url);

      if (
        !response.data ||
        !response.data.success ||
        !Array.isArray(response.data.results) ||
        response.data.results.length === 0
      ) {
        return bot.sendMessage(chatId, '❌ Aucune image trouvée. Essaie d’autres mots-clés.');
      }

      const images = response.data.results
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      for (const imageUrl of images) {
        await bot.sendPhoto(chatId, imageUrl, {
          caption: `📷 Résultat pour : ${query}\n> © Digital Crew 243`
        });

        // pause légère pour éviter le flood
        await new Promise(res => setTimeout(res, 800));
      }

    } catch (err) {
      console.error('Erreur commande img :', err);
      bot.sendMessage(
        chatId,
        '❌ Une erreur est survenue lors de la récupération des images.'
      );
    }
  }
};