module.exports.groupHandler = async (bot, member) => {
  const chatId = member.chat.id;
  const user = member.new_chat_member;
  if (!user || user.is_bot) return;

  const chat = await bot.getChat(chatId);
  const name = chat.title || 'ce groupe';
  const desc = chat.description || 'Aucune description disponible';
  const photoId = chat.photo?.big_file_id;

  const caption = `🎉 Bienvenue @${user.username || user.first_name} !\n\n👥 Groupe : *${name}*\n📝 Description : ${desc}`;

  if (photoId) {
    await bot.sendPhoto(chatId, photoId, { caption, parse_mode: 'Markdown' });
  } else {
    await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
  }
};