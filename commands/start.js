const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../users.json');

module.exports = {
  name: 'start',
  description: 'Démarre le bot et invite à rejoindre le canal',
  async execute(bot, msg) {
    const userId = msg.from.id;
    const userName = msg.from.first_name || 'utilisateur';
    const userUsername = msg.from.username ? `@${msg.from.username}` : 'Aucun';
    const channelUsername = '@digitalcrew2';

    try {
      const member = await bot.getChatMember(channelUsername, userId);
      const isSub = ['member', 'administrator', 'creator'].includes(member.status);

      let users = [];
      try {
        users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      } catch {
        users = [];
      }

      const isNew = !users.includes(userId);
      if (isNew) {
        users.push(userId);
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        const position = users.length;
        const adminChatId = process.env.ADMIN_CHAT_ID;
        if (adminChatId) {
          bot.sendMessage(
            adminChatId,
            `👤 Nouvel utilisateur\nNom: ${userName}\nUsername: ${userUsername}\nPosition: ${position}`
          );
        }
      }

      if (isSub) {
        bot.sendMessage(
          msg.chat.id,
          `Salut ${userName} 👋\nBienvenue sur Digital Crew !\nTu es maintenant abonné et tu peux utiliser mes commandes. Tape /help pour voir toutes les options.`
        );
      } else {
        bot.sendMessage(
          msg.chat.id,
          `Salut ${userName} 👋\nAvant d’utiliser mes commandes, abonne-toi à notre canal officiel.`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '📢 Rejoindre le canal', url: 'https://t.me/digitalcrew2' }],
                [{ text: '✅ J’ai rejoint', callback_data: 'verify_sub' }]
              ]
            }
          }
        );
      }
    } catch {
      bot.sendMessage(
        msg.chat.id,
        `Impossible de vérifier ton abonnement. Assure-toi que le bot est admin du canal.`
      );
    }
  }
};