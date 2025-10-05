const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Affiche toutes les commandes disponibles',
  execute(bot, msg) {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    let helpMessage = '📜 Liste des commandes disponibles :\n\n';

    commandFiles.forEach(file => {
      if (file === 'help.js') return; // éviter d’afficher la commande help dans la liste
      const command = require(path.join(commandsPath, file));
      helpMessage += `/${command.name} - ${command.description || 'Pas de description'}\n`;
    });

    bot.sendMessage(msg.chat.id, helpMessage);
  }
};