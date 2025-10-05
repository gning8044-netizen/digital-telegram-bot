module.exports = {
  name: 'start',
  description: 'Démarre le bot et invite à rejoindre le canal',
  async execute(bot, msg) {
    const userId = msg.from.id;
    const userName = msg.from.first_name || 'utilisateur';
    const channelUsername = '@digitalcrew2';

    try {
      const member = await bot.getChatMember(channelUsername, userId);
      const isSub = ['member', 'administrator', 'creator'].includes(member.status);

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