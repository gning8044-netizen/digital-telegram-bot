module.exports = {
  name: 'start',
  description: 'Démarre le bot et invite à rejoindre le canal',
  execute(bot, msg) {
    const user = msg.from.first_name || 'utilisateur';
    bot.sendMessage(
      msg.chat.id,
      `Salut ${user} 👋\nAvant d’utiliser mes commandes, abonne-toi à notre canal officiel.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Rejoindre le canal', url: 'https://t.me/TON_CANAL_ICI' }],
            [{ text: '✅ J’ai rejoint', callback_data: 'verify_sub' }]
          ]
        }
      }
    );
  }
};