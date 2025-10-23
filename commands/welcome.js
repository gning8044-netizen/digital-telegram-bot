module.exports = {
  name: 'kick',
  description: 'Expulse un membre du groupe',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;

    // Vérifie que la commande est utilisée dans un groupe
    if (msg.chat.type === 'private') {
      return bot.sendMessage(chatId, '❌ Cette commande ne peut être utilisée que dans un groupe.');
    }

    // Vérifie si l'utilisateur a répondu à un message
    const target = msg.reply_to_message?.from;
    if (!target && !args[0]) {
      return bot.sendMessage(chatId, '⚠️ Réponds au message de la personne à expulser ou indique son ID.');
    }

    const userId = target ? target.id : parseInt(args[0]);

    try {
      await bot.banChatMember(chatId, userId);
      await bot.unbanChatMember(chatId, userId); // autorise le retour si besoin
      bot.sendMessage(chatId, `🚪 L'utilisateur a été expulsé du groupe.`);
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, '❌ Impossible d’expulser cet utilisateur. Le bot doit être administrateur avec les permissions nécessaires.');
    }
  }
};