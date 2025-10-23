module.exports = {
  name: 'geturl',
  description: 'Récupère l’URL publique d’une image en répondant à celle-ci',

  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const reply = msg.reply_to_message;

    if (!reply || (!reply.photo && !reply.document)) {
      return bot.sendMessage(chatId, '📸 Réponds à une image pour obtenir son URL.');
    }

    try {
      const fileId = reply.photo ? reply.photo.pop().file_id : reply.document.file_id;
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

      await bot.sendMessage(chatId, `🌐 **URL de l’image :**\n${fileUrl}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔗 Ouvrir dans le navigateur', url: fileUrl }]
          ]
        }
      });
    } catch {
      bot.sendMessage(chatId, '❌ Impossible de récupérer l’URL de cette image.');
    }
  }
};