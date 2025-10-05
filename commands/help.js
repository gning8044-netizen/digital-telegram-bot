const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Affiche toutes les commandes disponibles avec style',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name || 'utilisateur';
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    
    let helpMessage = `✨ *Bienvenue ${userName} !* ✨\n\n`;
    helpMessage += '📚 *Liste des commandes disponibles :*\n\n';

    commandFiles.forEach(file => {
      if (file === 'help.js') return;
      const command = require(path.join(commandsPath, file));
      helpMessage += `• /${command.name} - ${command.description || 'Pas de description'}\n`;
    });

    helpMessage += `\n🚀 Tape la commande pour l’exécuter !`;

    try {
      
      const photos = await bot.getUserProfilePhotos(userId, 0, 1);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        bot.sendPhoto(chatId, fileId, { caption: helpMessage, parse_mode: 'Markdown' });
      } else {
        bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
      }
    } catch {
      bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    }
  }
};