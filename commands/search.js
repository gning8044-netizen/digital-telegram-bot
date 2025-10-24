const axios = require('axios');

module.exports = {
  name: 'brsearch',
  description: 'Recherche web via Brave Search API',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ').trim();
    if (!query) {
      return bot.sendMessage(chatId, '🔎 Utilisation : /brsearch [termes]', { reply_to_message_id: msg.message_id });
    }

    const apiKey = 'TA_CLE_API_BRAVE_ICI'; // 🔑 Remplace par ta clé Brave Search

    try {
      const res = await axios.get('https://api.search.brave.com/res/v1/web/search', {
        headers: { 'X-Subscription-Token': apiKey },
        params: {
          q: query,
          count: 5,
          search_lang: 'fr'
        }
      });

      const data = res.data;
      if (!data || !data.results || data.results.length === 0) {
        const url = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
        return bot.sendMessage(chatId, `ℹ️ Aucun résultat direct. Voir : ${url}`, { reply_to_message_id: msg.message_id });
      }

      let message = `🔍 Résultats pour *${query}* :\n\n`;
      data.results.slice(0, 5).forEach((r, i) => {
        const title = r.title || r.headline || 'Sans titre';
        const link = r.url || r.first_url || '';
        message += `${i + 1}. [${title}](${link})\n`;
      });

      bot.sendMessage(chatId, message, { parse_mode: 'Markdown', disable_web_page_preview: true, reply_to_message_id: msg.message_id });
    } catch (err) {
      bot.sendMessage(chatId, '⚠️ Erreur lors de la recherche.', { reply_to_message_id: msg.message_id });
    }
  }
};