const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Affiche toutes les commandes disponibles avec menu cliquable',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name || 'utilisateur';
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'help.js');

    const adminId = require.main.require('./index.js').adminChatId;

    let inline_keyboard = [];

    // commandes normales
    commandFiles.forEach(file => {
      const command = require(path.join(commandsPath, file));
      if (['ban', 'unban', 'stats'].includes(command.name)) return; // exclure les commandes admin du menu principal
      inline_keyboard.push([{ text: command.name, callback_data: `run_${command.name}` }]);
    });

    // si admin, ajouter bouton Admin
    if (userId.toString() === adminId.toString()) {
      inline_keyboard.push([{ text: '🛠 Admin', callback_data: 'admin_menu' }]);
    }

    const message = `✨ Bienvenue ${userName} !\n\n📚 Liste des commandes disponibles :`;

    bot.sendMessage(chatId, message, {
      reply_markup: { inline_keyboard }
    });
  }
};

// Gestion des callbacks pour afficher le sous-menu Admin
module.exports.adminMenuHandler = async (bot, query) => {
  const adminId = require.main.require('./index.js').adminChatId;
  if (query.from.id.toString() !== adminId.toString()) {
    return bot.answerCallbackQuery(query.id, { text: '🚫 Accès refusé.' });
  }

  if (query.data === 'admin_menu') {
    const adminCommands = [
      { text: 'Ban', callback_data: 'run_ban' },
      { text: 'Unban', callback_data: 'run_unban' },
      { text: 'Stats', callback_data: 'run_stats' },
      { text: '🔙 Retour', callback_data: 'run_help' }
    ];

    await bot.editMessageText('🛠 Menu Admin', {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      reply_markup: { inline_keyboard: adminCommands.map(c => [c]) }
    });

    bot.answerCallbackQuery(query.id);
  }
};