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

module.exports = {
  name: 'myid',
  description: 'Renvoie ton ID Telegram ou celui d’un utilisateur (admin)',
  async execute(bot, msg, args) {
    const userId = msg.from.id;
    const isAdmin = userId.toString() === adminChatId.toString();

    if (!args[0] && !msg.reply_to_message) {
      // ID de l'utilisateur lui-même
      const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || 'Inconnu';
      return bot.sendMessage(msg.chat.id, `👤 Ton ID Telegram : \`${userId}\`\nNom/Username : ${username}`, { parse_mode: 'Markdown' });
    }

    if (!isAdmin) {
      return bot.sendMessage(msg.chat.id, '🚫 Accès refusé. Cette commande peut être utilisée uniquement par l’admin pour d’autres utilisateurs.');
    }

    let targetId;
    if (args[0]) {
      targetId = parseInt(args[0]);
    } else if (msg.reply_to_message) {
      targetId = msg.reply_to_message.from.id;
    }

    const users = getUsers();
    const target = users.find(u => u.id === targetId);

    if (!target) return bot.sendMessage(msg.chat.id, `Utilisateur introuvable ou non enregistré dans users.json.`);

    bot.sendMessage(msg.chat.id, `👤 Infos utilisateur :\nNom : ${target.first_name || 'Inconnu'}\nUsername : ${target.username || 'Aucun'}\nID : \`${target.id}\`\nBanni : ${target.banned ? '🚫 Oui' : '✅ Non'}`, { parse_mode: 'Markdown' });
  }
};