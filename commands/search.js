module.exports = {
  name: 'brsearch',
  description: 'Recherche web simple',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ').trim();
    if (!query) {
      return bot.sendMessage(chatId, '🔎 Utilisation : /brsearch [termes]', { reply_to_message_id: msg.message_id });
    }

    const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    bot.sendMessage(chatId, `ℹ️ Résultats pour *${query}* :\n${url}`, {
      parse_mode: 'Markdown',
      reply_to_message_id: msg.message_id
    });
  }
};