module.exports = {
  name: 'welcome',
  description: 'Souhaite la bienvenue aux nouveaux membres du groupe',
  async execute(bot, msg) {
    bot.sendMessage(msg.chat.id, '✅ Le système de bienvenue est actif pour ce groupe.');
  }
};

module.exports.groupHandler = async (bot, msg) => {
  if (!msg.new_chat_members || msg.new_chat_members.length === 0) return;

  const chatId = msg.chat.id;
  const chat = await bot.getChat(chatId);
  const name = chat.title || 'ce groupe';
  const desc = chat.description || 'Aucune description disponible';

  let photoId = null;
  try {
    const chatPhotos = await bot.getChat(chatId);
    if (chat.photo) {
      photoId = chat.photo.big_file_id || chat.photo.small_file_id;
    }
  } catch {}

  for (const user of msg.new_chat_members) {
    if (user.is_bot) continue;

    const username = user.username ? `@${user.username}` : user.first_name;
    const text = `🎉 Bienvenue ${username} !\n\n👥 Groupe : *${name}*\n📝 Description : ${desc}`;

    if (photoId) {
      await bot.sendPhoto(chatId, photoId, { caption: text, parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    }
  }
};