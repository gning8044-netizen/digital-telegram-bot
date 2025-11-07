const axios = require('axios');

module.exports = {
  name: 'source',
  description: 'Affiche le code source HTML d’une page web',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const url = (args || []).join(' ').trim();
    if (!url) return bot.sendMessage(chatId, "🔎 Utilisation : /source [URL]", { reply_to_message_id: msg.message_id });

    let targetUrl = url;
    if (!/^https?:\/\//i.test(url)) targetUrl = 'http://' + url;

    try {
      const response = await axios.get(targetUrl, { timeout: 10000 });
      const html = response.data;

      const CHUNK = 3800;
      for (let i = 0; i < html.length; i += CHUNK) {
        await bot.sendMessage(chatId, '```html\n' + html.substring(i, i + CHUNK) + '\n```', { parse_mode: 'Markdown' });
      }
    } catch (e) {
      bot.sendMessage(chatId, `❌ Impossible de récupérer le code source de ${targetUrl}`);
    }
  }
};
