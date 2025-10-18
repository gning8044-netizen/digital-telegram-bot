const fs = require('fs');
const path = require('path');
const { adminChatId } = require('../index.js');
const usersFile = path.join(__dirname, '../users.json');

function getUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile));
  } catch {
    return [];
  }
}

function updateUser(user) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  }
}

module.exports = {
  name: 'ban',
  description: 'Bannir un utilisateur (admin only)',
  async execute(bot, msg, args) {
    if (msg.from.id.toString() !== adminChatId.toString())
      return bot.sendMessage(msg.chat.id, '🚫 Accès refusé.');

    let userId;
    if (args[0]) {
      userId = parseInt(args[0]);
    } else if (msg.reply_to_message) {
      userId = msg.reply_to_message.from.id;
    } else {
      return bot.sendMessage(msg.chat.id, 'Usage : /ban <id> ou reply à un message.');
    }

    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return bot.sendMessage(msg.chat.id, 'Utilisateur introuvable.');

    if (user.banned) return bot.sendMessage(msg.chat.id, 'Cet utilisateur est déjà banni.');

    user.banned = true;
    updateUser(user);

    bot.sendMessage(msg.chat.id, `🚷 L'utilisateur ${user.username || user.first_name} a été banni.`);
    try {
      await bot.sendMessage(userId, '🚫 Tu as été banni de ce bot. Contacte l’administrateur si nécessaire.');
    } catch {
      // ignore si l'utilisateur bloque le bot ou n'est pas accessible
    }
  }
};