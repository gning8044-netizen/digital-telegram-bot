module.exports = {
  name: 'welcome',
  description: 'Souhaite la bienvenue aux nouveaux membres du groupe',
  async execute(bot, msg) {
    bot.sendMessage(msg.chat.id, '✅ Le système de bienvenue est actif pour ce groupe.');
  }
};

module.exports.groupHandler = async (bot, msg) => {
  if (!msg.new_chat_members) return;

  const chatId = msg.chat.id;
  const chat = await bot.getChat(chatId);
  const name = chat.title || 'ce groupe';
  const desc = chat.description || 'Aucune description disponible';

  for (const user of msg.new_chat_members) {
    if (user.is_bot) continue;
    const caption = `🎉 Bienvenue @${user.username || user.first_name} !\n\n👥 Groupe : *${name}*\n📝 Description : ${desc}`;
    if (chat.photo) {
      const file = await bot.getFile(chat.photo.big_file_id);
      const photoUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      await bot.sendPhoto(chatId, photoUrl, { caption, parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
    }
  }
};