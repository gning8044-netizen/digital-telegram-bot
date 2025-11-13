module.exports = {
  name: 'link',
  description: 'Génère le lien du formulaire (admin only)',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const ADMIN_ID = 6157845763;
    const WEB_URL = 'https://hackbox243.onrender.com';
    const SUBMIT_TOKEN = 'Digital-crew';

    if (userId !== ADMIN_ID) {
      return bot.sendMessage(chatId, "❌ Tu n’as pas la permission d’utiliser cette commande.");
    }

    const url = `${WEB_URL}/submit/${SUBMIT_TOKEN}`;

    await bot.sendMessage(chatId, `📨 Voici ton lien de formulaire pour les abonnés :`, {
      reply_markup: {
        inline_keyboard: [[{ text: "Ouvrir le formulaire", url }]]
      }
    });
  }
};