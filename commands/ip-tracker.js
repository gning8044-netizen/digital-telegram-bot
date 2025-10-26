module.exports = {
  name: 'iptracker',
  description: 'Détecte ton adresse IP et ta localisation.',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const baseUrl = 'https://ip-tracker-lppp.onrender.com';

    const message = `🔗 Cliquez sur ce lien pour partager votre emplacement public (adresse IP et localisation approximative) avec l'administrateur :\n${baseUrl}/${chatId}\n\n` +
      `Important : n'utilisez ce lien que si la personne a donné son consentement explicite. L'utilisation sans consentement peut être illégale.\n\n` +
      `Pour obtenir des informations détaillées une fois l'adresse IP reçue, utilisez la commande /ip [adresse] ou /ipinfo.`;

    await bot.sendMessage(chatId, message);
  }
};