module.exports = {
  name: 'iptracker',
  description: 'Détecte ton adresse IP et ta localisation.',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const baseUrl = 'https://numero-virtuel.onrender.com';

    const message = `🔗 📍 Copiez le lien ci-dessous et envoyez-le à votre victime  
Pour connaître son emplacement, sa localisation exacte 📡  
et même voir son adresse IP 🔍  
👇  
⚠️ Utilisation à vos risques et périls. Pour but éducatif uniquement. :\n${baseUrl}/${chatId}\n\n` +
      `Pour obtenir des informations détaillées une fois l'adresse IP reçue, utilisez la commande /ipinfo.`;

    await bot.sendMessage(chatId, message);
  }
};