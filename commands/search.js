const axios = require('axios');

const BLOCK_PATTERNS = [
  /crack/i,
  /cracked/i,
  /torrent/i,
  /warez/i,
  /keygen/i,
  /serial[- ]?key/i,
  /patch/i,
  /pirat/i,
  /buy[- ]?crack/i,
  /disabled[- ]?protection/i,
  /bypass/i
];

module.exports = {
  name: 'search',
  description: 'Recherche web (DuckDuckGo) et renvoie quelques résultats utiles',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const args = msg.text ? msg.text.split(' ').slice(1) : [];
    if (args.length === 0) {
      return bot.sendMessage(chatId, '🔎 Utilisation : /search [termes]\nEx : /search site apk android', { reply_to_message_id: msg.message_id });
    }

    const query = args.join(' ').trim();
    for (const re of BLOCK_PATTERNS) {
      if (re.test(query)) {
        return bot.sendMessage(chatId, "🚫 Requête refusée — je ne peux pas aider à trouver du contenu piraté, des cracks, des torrents ou des moyens de contourner des protections. Formule ta recherche autrement.", { reply_to_message_id: msg.message_id });
      }
    }

    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const res = await axios.get(url, { timeout: 10000 });
      const data = res.data || {};

      const lines = [];
      if (data.AbstractText) {
        lines.push(`📝 Résumé : ${data.AbstractText}`);
        if (data.AbstractURL) lines.push(`🔗 Source : ${data.AbstractURL}`);
      }

      const gather = (items) => {
        const out = [];
        for (const it of items) {
          if (it.Topics) {
            out.push(...gather(it.Topics));
          } else {
            const text = it.Text || '';
            const firstUrl = it.FirstURL || '';
            if (firstUrl) out.push({ text, url: firstUrl });
          }
          if (out.length >= 6) break;
        }
        return out;
      };

      let hits = [];
      if (Array.isArray(data.RelatedTopics)) hits = gather(data.RelatedTopics);

      if (hits.length === 0 && data.Results && Array.isArray(data.Results)) {
        hits = data.Results.slice(0, 6).map(r => ({ text: r.Text || r.Result || r.Heading || r.FirstURL || '', url: r.FirstURL || '' }));
      }

      if (hits.length > 0) {
        lines.push('\n🔎 Résultats :');
        hits.slice(0, 6).forEach((h, i) => {
          const t = h.text ? h.text.replace(/\n/g, ' ').trim() : '';
          lines.push(`${i + 1}. ${t}\n${h.url}`);
        });
      } else {
        const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        lines.push(`ℹ️ Aucun résultat direct. Voir la page de recherche : ${searchUrl}`);
      }

      const message = lines.join('\n\n');
      await bot.sendMessage(chatId, message, { reply_to_message_id: msg.message_id });
    } catch (err) {
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      await bot.sendMessage(chatId, `⚠️ Erreur pendant la recherche. Tu peux essayer directement : ${searchUrl}`, { reply_to_message_id: msg.message_id });
    }
  }
};