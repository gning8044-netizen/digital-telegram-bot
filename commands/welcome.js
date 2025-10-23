module.exports = {
  name: 'kick',
  description: 'Expulse un membre du groupe (réservé aux administrateurs)',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;

    if (msg.chat.type === 'private') {
      return bot.sendMessage(chatId, '❌ Cette commande ne peut être utilisée que dans un groupe.');
    }

    try {
      // Vérifie si l'utilisateur est admin
      const member = await bot.getChatMember(chatId, msg.from.id);
      if (!['administrator', 'creator'].includes(member.status)) {
        return bot.sendMessage(chatId, '🚫 Seuls les administrateurs peuvent utiliser cette commande.');
      }

      // Détermine la cible
      const target = msg.reply_to_message?.from;
      if (!target && !args[0]) {
        return bot.sendMessage(chatId, '⚠️ Réponds au message de la personne à expulser ou indique son ID.');
      }

      const userId = target ? target.id : parseInt(args[0]);

      await bot.banChatMember(chatId, userId);
      await bot.unbanChatMember(chatId, userId); // pour permettre un retour éventuel

      bot.sendMessage(chatId, `🚪 L'utilisateur [${target?.first_name || userId}](tg://user?id=${userId}) a été expulsé.`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, '❌ Impossible d’expulser cet utilisateur. Le bot doit être administrateur avec les permissions nécessaires.');
    }
  }
};