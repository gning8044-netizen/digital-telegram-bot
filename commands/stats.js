const fs = require('fs');
const path = require('path');
const { adminChatId } = require('../index.js');
const usersFile = path.join(__dirname, '../users.json');

module.exports = {
  name: 'stats',
  description: 'Affiche les statistiques du bot (admin seulement)',
  async execute(bot, msg) {
    if (msg.from.id.toString() !== adminChatId.toString())
      return bot.sendMessage(msg.chat.id, '🚫 Accès refusé.');

    let users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

    const total = users.length;
    const banned = users.filter(u => u.banned).length;
    const active = total - banned;

    const message = `
📊 *Statistiques du bot*
━━━━━━━━━━━━━━
👥 Total utilisateurs : *${total}*
✅ Actifs : *${active}*
🚫 Bannis : *${banned}*
━━━━━━━━━━━━━━
👑 Admin : \`${adminChatId}\`
`;

    bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
  }
};