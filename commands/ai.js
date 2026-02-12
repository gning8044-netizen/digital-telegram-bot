const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Discuter avec Copilot AI via Kyotaka API',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🤖 **Digital Crew AI**\n\n' +
        'Pose ta question à l\'IA Copilot.\n\n' +
        '**Utilisation :**\n' +
        '• `/ai Quelle est la capitale du Japon?`\n' +
        '• `/ai Explique la relativité`\n' +
        '• `/ai --deep Réfléchis en profondeur`\n' +
        '• `/ai --gpt5 Utilise GPT-5`\n\n' +
        '✨ Généré par Alphaconnect\n© Digital Crew 243',
        { parse_mode: 'Markdown' }
      );
    }

    // Détecter les modèles spéciaux
    let model = 'default';
    let prompt = query;
    
    if (query.includes('--deep')) {
      model = 'think-deeper';
      prompt = query.replace('--deep', '').trim();
    } else if (query.includes('--gpt5')) {
      model = 'gpt-5';
      prompt = query.replace('--gpt5', '').trim();
    }

    const waitMsg = await bot.sendMessage(chatId, '🤔 Copilot réfléchit...');

    try {
      // L'API est à la racine, pas sur /api/chat
      const apiUrl = 'https://kyotaka-api.vercel.app/';
      
      const response = await axios({
        method: 'GET', // ou 'POST' selon ce que tu préfères
        url: apiUrl,
        params: {
          message: prompt,
          model: model
        },
        timeout: 45000 // Timeout 45 secondes (WebSocket peut prendre du temps)
      });

      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

      if (response.data && response.data.message) {
        let reply = response.data.message;
        
        // Couper si trop long
        if (reply.length > 4000) {
          reply = reply.substring(0, 4000) + '...\n\n📌 Message tronqué (4000 caractères max)';
        }

        await bot.sendMessage(
          chatId,
          `🤖 **Copilot AI**\n\n${reply}\n\n✨ Généré par Alphaconnect\n© Digital Crew 243`,
          { parse_mode: 'Markdown' }
        );
      } else {
        throw new Error('Format de réponse invalide');
      }

    } catch (error) {
      console.error('AI ERROR:', error.message);
      
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      
      let errorMsg = '❌ Erreur de connexion à l\'API.';
      if (error.code === 'ECONNABORTED') {
        errorMsg = '⏰ Délai d\'attente dépassé. Copilot met trop de temps à répondre.';
      }
      
      bot.sendMessage(chatId, errorMsg);
    }
  }
};