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
        '🖼️ Fournis des mots-clés\nExemple : /img chat'
      );
    }

    try {
      await bot.sendMessage(chatId, `🔍 Recherche « ${query} »...`);

      const apiUrl = `https://christus-api.vercel.app/image/Pinterest?query=${encodeURIComponent(query)}&limit=10`;
      
      const response = await axios.get(apiUrl, { timeout: 15000 });

      if (!response.data || !response.data.status || !response.data.results || response.data.results.length === 0) {
        return bot.sendMessage(chatId, '❌ Aucune image trouvée.');
      }

      const images = response.data.results
        .filter(item => item.imageUrl && item.imageUrl.match(/\.(jpg|jpeg|png|webp)/i))
        .slice(0, 5);

      if (images.length === 0) {
        return bot.sendMessage(chatId, '❌ Aucune image valide trouvée.');
      }

      for (const image of images) {
        try {
          await bot.sendPhoto(chatId, image.imageUrl, {
            caption: `📷 ${query}\n${image.title !== 'No title' ? image.title : ''}\n© Digital Crew`
          });
          await new Promise(r => setTimeout(r, 1000));
        } catch (photoError) {
          continue;
        }
      }

    } catch (error) {
      console.error('IMG ERROR:', error.message);
      bot.sendMessage(chatId, '❌ Erreur API Pinterest.');
    }
  }
};