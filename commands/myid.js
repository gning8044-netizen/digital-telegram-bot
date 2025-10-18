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
  } else {
    users.push({ ...user, banned: false });
  }
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

module.exports = {
  name: 'myid',
  description: 'Renvoie ton ID Telegram et informe l’admin',
  async execute(bot, msg) {
    const userId = msg.from.id;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || 'Inconnu';
    const first_name = msg.from.first_name || '';
    const last_name = msg.from.last_name || '';

    const users = getUsers();
    let user = users.find(u => u.id === userId);
    if (!user) {
      user = { id: userId, username, first_name, last_name, banned: false };
      updateUser(user);
    }

    // Message à l'utilisateur lui-même (toujours)
    await bot.sendMessage(msg.chat.id, `👤 Ton ID Telegram : \`${userId}\`\nNom/Username : ${username}`, { parse_mode: 'Markdown' });

    // Message à l'admin (si ce n'est pas l'admin qui utilise)
    if (userId.toString() !== adminChatId.toString()) {
      const bannedStatus = user.banned ? '🚫 Banni' : '✅ Actif';
      await bot.sendMessage(adminChatId, `🔹 /myid utilisé\nNom : ${first_name}\nNom d'utilisateur : ${username}\nID : \`${userId}\`\nStatut : ${bannedStatus}`, { parse_mode: 'Markdown' });
    }
  }
};