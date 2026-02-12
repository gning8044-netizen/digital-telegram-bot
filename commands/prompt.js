const axios = require('axios');

module.exports = {
  name: 'prompt',
  description: 'Générer un prompt IA',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🎨 Utilisation : /prompt <description>\n' +
        'Exemple : /prompt un chat samouraï futuriste'
      );
    }

    try {
      await bot.sendMessage(chatId, `⏳ Génération du prompt pour "${query}"...`);

      const apiUrl = `https://seaart-ai.apis-bj-devs.workers.dev/?Prompt=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl, { timeout: 15000 });
      
      let result = response.data;
      
      if (typeof result === 'object') {
        result = JSON.stringify(result, null, 2);
      }

      await bot.sendMessage(
        chatId,
        `🎯 Prompt généré :\n\n${result}\n\n📌 Copie ce texte dans un générateur d'images IA.`
      );

    } catch (error) {
      console.error('PROMPT ERROR:', error.message);
      bot.sendMessage(chatId, '❌ Erreur API. Réessaie plus tard.');
    }
  }
};