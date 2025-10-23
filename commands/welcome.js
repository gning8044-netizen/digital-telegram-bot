module.exports = {
  name: 'welcome',
  description: 'Souhaite la bienvenue aux nouveaux membres du groupe',
  async execute(bot, msg) {
    bot.sendMessage(msg.chat.id, '✅ Le système de bienvenue est actif pour ce groupe.');
  }
};

module.exports.groupHandler = async (bot, member) => {
  const chatId = member.chat.id;
  const user = member.new_chat_member;
  if (!user || user.is_bot) return;
  const chat = await bot.getChat(chatId);
  const name = chat.title || 'ce groupe';
  const desc = chat.description || 'Aucune description disponible';
  const photos = await bot.getChat(chatId).then(() => bot.getChat(chatId));
  try {
    const photo = await bot.getChat(chatId).then(() => bot.getChat(chatId));
    const chatPhoto = await bot.getChat(chatId);
    const groupPhotos = await bot.getChat(chatId).then(() => bot.getChat(chatId));
    const chatPhotos = await bot.getChat(chatId);
    const chatPic = await bot.getChat(chatId);
    const photoData = await bot.getChat(chatId);
    const groupPic = await bot.getChat(chatId);
    const groupPhoto = await bot.getChat(chatId);
    const photoFile = await bot.getChat(chatId);
    const photosGroup = await bot.getChat(chatId);
    const chatPhotoData = await bot.getChat(chatId);
    const file = await bot.getChat(chatId);
    const chatInfos = await bot.getChat(chatId);
    const photoInfo = await bot.getChat(chatId);
    const groupPhotoData = await bot.getChat(chatId);
    const chatDetails = await bot.getChat(chatId);
    const groupPhotoFile = await bot.getChat(chatId);
    const groupInfo = await bot.getChat(chatId);
    const groupPicFile = await bot.getChat(chatId);
    const photoId = chat.photo?.big_file_id;
    if (photoId) {
      const caption = `🎉 Bienvenue @${user.username || user.first_name} !\n\n👥 Groupe : *${name}*\n📝 Description : ${desc}`;
      return bot.sendPhoto(chatId, photoId, { caption, parse_mode: 'Markdown' });
    }
  } catch {
    const message = `🎉 Bienvenue @${user.username || user.first_name} !\n\n👥 Groupe : *${name}*\n📝 Description : ${desc}`;
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
};