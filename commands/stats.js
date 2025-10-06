const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../users.json');

module.exports = {
  name: 'stats',
  description: 'Affiche les statistiques et permet de gérer les utilisateurs',
  async execute(bot, msg, args) {
    const adminId = require.main.require('./index.js').adminChatId;
    if (msg.from.id.toString() !== adminId.toString()) return bot.sendMessage(msg.chat.id, '🚫 Accès refusé.');

    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    } catch {
      users = [];
    }

    if (args[0] === 'ban' && args[1]) {
      const userId = args[1];
      if (!users.find(u => u.id == userId)) return bot.sendMessage(msg.chat.id, 'Utilisateur introuvable.');
      users = users.map(u => (u.id == userId ? { ...u, banned: true } : u));
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
      return bot.sendMessage(msg.chat.id, `🚷 L'utilisateur ${userId} a été banni.`);
    }

    if (args[0] === 'unban' && args[1]) {
      const userId = args[1];
      if (!users.find(u => u.id == userId)) return bot.sendMessage(msg.chat.id, 'Utilisateur introuvable.');
      users = users.map(u => (u.id == userId ? { ...u, banned: false } : u));
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
      return bot.sendMessage(msg.chat.id, `✅ L'utilisateur ${userId} a été débanni.`);
    }

    const total = users.length;
    const bannedCount = users.filter(u => u.banned).length;
    const active = total - bannedCount;

    let message = `📊 *Statistiques du bot*\n\n👥 Utilisateurs totaux: ${total}\n✅ Actifs: ${active}\n🚫 Banné(s): ${bannedCount}\n\n👤 *Liste des utilisateurs :*\n`;

    if (users.length > 0) {
      message += users
        .map(
          (u, i) =>
            `${i + 1}. ${u.name || 'Inconnu'} (${u.username || 'Aucun'})\nID: \`${u.id}\`\nStatut: ${u.banned ? '🚫 Banné' : '✅ Actif'}\n`
        )
        .join('\n');
    } else message += 'Aucun utilisateur enregistré.';

    bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
  }
};