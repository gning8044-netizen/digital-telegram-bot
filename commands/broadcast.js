const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'broadcast',
  description: 'Envoie un message à tous les utilisateurs (admin uniquement)',
  async execute(bot, msg, args) {
    const adminId = require.main.require('./index.js').adminChatId;
    const senderId = msg.from.id;

    if (senderId.toString() !== adminId.toString()) {
      return bot.sendMessage(msg.chat.id, '🚫 Accès refusé. Commande réservée à l’administrateur.');
    }

    const text = args.join(' ');
    if (!text) {
      return bot.sendMessage(msg.chat.id, '⚠️ Utilisation : /broadcast [message]');
    }

    const usersFile = path.join(__dirname, '../users.json');
    if (!fs.existsSync(usersFile)) {
      return bot.sendMessage(msg.chat.id, 'Aucun utilisateur trouvé.');
    }

    const users = JSON.parse(fs.readFileSync(usersFile));
    let success = 0;
    let failed = 0;

    for (const user of users) {
      if (user.banned) continue;
      try {
        await bot.sendMessage(user.id, text);
        success++;
      } catch {
        failed++;
      }
    }

    bot.sendMessage(adminId, `✅ Message envoyé à ${success} utilisateur(s).\n❌ Échec pour ${failed}.`);
  }
};