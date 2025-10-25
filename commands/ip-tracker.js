module.exports = {
  name: 'iptracker',
  description: 'Détecte ton adresse IP et ta localisation.',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const baseUrl = 'https://ip-tracker-lppp.onrender.com'; 

    await bot.sendMessage(chatId,
      `🌐 Clique ici pour détecter ton IP :\n${baseUrl}/${chatId}\n\n` +
      `Le bot t’enverra automatiquement les infos dès que c’est fait.`
    );
  }
};