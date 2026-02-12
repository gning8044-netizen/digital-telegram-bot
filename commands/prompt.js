const axios = require('axios');

module.exports = {
  name: 'prompt',
  description: 'Générer un prompt IA pour créer des images',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🎨 **Générateur de prompts IA**\n\n' +
        'Décris ce que tu veux voir :\n' +
        'Exemple : `/prompt un chat cyberpunk néon`\n' +
        'Exemple : `/prompt paysage fantasy mystique`',
        { parse_mode: 'Markdown' }
      );
    }

    try {
      await bot.sendMessage(
        chatId, 
        `⏳ Génération du prompt pour « ${query} »...`
      );

      const apiUrl = `https://seaart-ai.apis-bj-devs.workers.dev/?Prompt=${encodeURIComponent(query)}`;
      
      const response = await axios.get(apiUrl, { timeout: 20000 });
      
      if (!response.data) {
        return bot.sendMessage(chatId, '❌ Aucune réponse de l\'API.');
      }

      // Vérifier si l'API retourne une erreur
      if (response.data.status === 'error') {
        return bot.sendMessage(
          chatId, 
          `❌ Erreur API : ${response.data.message || 'Erreur inconnue'}`
        );
      }

      // Formater la réponse selon le type de données reçu
      let promptText = '';
      if (typeof response.data === 'string') {
        promptText = response.data;
      } else if (typeof response.data === 'object') {
        promptText = JSON.stringify(response.data, null, 2);
      } else {
        promptText = String(response.data);
      }

      // Envoyer le prompt généré
      await bot.sendMessage(
        chatId,
        `🎯 **Prompt généré avec succès !**\n\n` +
        `📝 **Description :** ${query}\n\n` +
        `✨ **Résultat :**\n\`\`\`\n${promptText}\n\`\`\`\n\n` +
        `🖼️ Copie ce prompt dans un générateur d'images IA (Midjourney, Stable Diffusion, DALL-E...)`,
        { parse_mode: 'Markdown' }
      );

    } catch (error) {
      console.error('PROMPT ERROR:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        return bot.sendMessage(chatId, '⏰ Délai d\'attente dépassé. Réessaie plus tard.');
      }
      
      if (error.response && error.response.status === 500) {
        return bot.sendMessage(chatId, '🔧 L\'API est momentanément indisponible.');
      }
      
      bot.sendMessage(
        chatId,
        '❌ Erreur lors de la génération du prompt.\n' +
        'Vérifie ta description ou réessaie plus tard.'
      );
    }
  }
};