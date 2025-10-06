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
    const adminChatId = require.main.require('../index.js').adminChatId;

    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    } catch {
      users = [];
    }

    const existingUser = users.find(u => u.id === userId);
    if (!existingUser) {
      users.push({ id: userId, name: userName, username: userUsername, banned: false });
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
      const position = users.length;
      bot.sendMessage(adminChatId, `👤 Nouvel utilisateur\nNom: ${userName}\nUsername: ${userUsername}\nPosition: ${position}`);
    }

    let isSub = false;

    try {
      const chat = await bot.getChat(channelUsername);
      const member = await bot.getChatMember(chat.id, userId);
      isSub = ['member', 'administrator', 'creator'].includes(member.status);
    } catch (err) {
      // petit délai avant de réessayer, Telegram lag souvent ici
      await new Promise(r => setTimeout(r, 1500));
      try {
        const chat = await bot.getChat(channelUsername);
        const member = await bot.getChatMember(chat.id, userId);
        isSub = ['member', 'administrator', 'creator'].includes(member.status);
      } catch {
        isSub = false;
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
  }
};