const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Affiche toutes les commandes disponibles avec boutons cliquables',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name || 'utilisateur';
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const buttons = commandFiles
      .filter(f => f !== 'help.js')
      .map(file => {
        const command = require(path.join(commandsPath, file));
        return [{ text: `/${command.name}`, callback_data: `run_${command.name}` }];
      });

    const helpMessage = `✨ *Bienvenue ${userName} !* ✨\n\n📚 *Liste des commandes disponibles :*`;

    try {
      const photos = await bot.getUserProfilePhotos(userId, 0, 1);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        await bot.sendPhoto(chatId, fileId, {
          caption: helpMessage,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: buttons }
        });
      } else {
        await bot.sendMessage(chatId, helpMessage, {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: buttons }
        });
      }
    } catch {
      await bot.sendMessage(chatId, helpMessage, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  }
};