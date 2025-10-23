module.exports = {
  name: 'geturl',
  description: 'Récupère l’URL publique d’une image en répondant à celle-ci',

  async execute(bot, msg) {
    const chatId = msg.chat.id;
    if (!msg.reply_to_message || !msg.reply_to_message.photo) {
      return bot.sendMessage(chatId, '📸 Réponds à une image pour obtenir son URL.');
    }
    try {
      const photo = msg.reply_to_message.photo.pop();
      const file = await bot.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      bot.sendMessage(chatId, `🌐 **URL de l’image :**\n${fileUrl}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔗 Ouvrir dans le navigateur', url: fileUrl }]
          ]
        }
      });
    } catch (err) {
      bot.sendMessage(chatId, '❌ Impossible de récupérer l’URL de cette image.');
    }
  }
};