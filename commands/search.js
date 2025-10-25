const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  name: 'search',
  description: 'Recherche web gratuite via DuckDuckGo',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ').trim();
    if (!query) {
      return bot.sendMessage(chatId, '🔎 Utilisation : /brsearch [termes]', { reply_to_message_id: msg.message_id });
    }

    try {
      const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const $ = cheerio.load(data);

      const results = [];
      $('.result__a').each((i, el) => {
        if (i < 5) results.push({
          title: $(el).text(),
          link: $(el).attr('href')
        });
      });

      if (results.length === 0) {
        return bot.sendMessage(chatId, `ℹ️ Aucun résultat direct. Voir : https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
          reply_to_message_id: msg.message_id
        });
      }

      let message = `🔍 Résultats pour *${query}* :\n\n`;
      results.forEach((r, i) => {
        message += `${i + 1}. [${r.title}](${r.link})\n`;
      });

      bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_to_message_id: msg.message_id
      });
    } catch (err) {
      bot.sendMessage(chatId, '⚠️ Erreur lors de la recherche.', { reply_to_message_id: msg.message_id });
    }
  }
};