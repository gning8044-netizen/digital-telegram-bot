const axios = require('axios');

module.exports = {
  name: 'img',
  description: 'Recherche et envoie des images selon un mot-clé',
  async execute(bot, msg, args) {
    try {
      if (args.length < 1) {
        return bot.sendMessage(msg.chat.id, '❌ *Utilisation:* `/img [mot-clé] [nombre]`\nExemple: `/img ordinateur 5`', { parse_mode: 'Markdown' });
      }

      const query = args[0];
      const count = parseInt(args[1]) || 3;

      await bot.sendMessage(msg.chat.id, `🔎 Recherche d’images pour *${query}*...`, { parse_mode: 'Markdown' });

      const res = await axios.get(`https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&iax=images&ia=images`);
      const results = res.data.results.slice(0, count);

      if (results.length === 0) {
        return bot.sendMessage(msg.chat.id, `❌ Aucune image trouvée pour "${query}".`);
      }

      for (const image of results) {
        await bot.sendPhoto(msg.chat.id, image.image, { caption: `🖼️ *${query}*`, parse_mode: 'Markdown' });
      }

    } catch (error) {
      console.error('Erreur image:', error.message);
      bot.sendMessage(msg.chat.id, '⚠️ Erreur lors de la recherche d’images ou aucune image trouvée.');
    }
  }
};