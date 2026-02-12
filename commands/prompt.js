const axios = require('axios');

module.exports = {
  name: 'imagine',
  description: 'Générer une image IA avec SeaArt',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🎨 **Générateur d\'images IA**\n\n' +
        'Décris l\'image que tu veux créer :\n' +
        'Exemple : `/imagine un chat cyberpunk`\n' +
        'Exemple : `/imagine paysage fantasy`',
        { parse_mode: 'Markdown' }
      );
    }

    try {
      const statusMsg = await bot.sendMessage(
        chatId, 
        `🎨 Création de l'image pour « ${query} »...\n⏳ Cela peut prendre 20-30 secondes.`
      );

      const apiUrl = `https://seaart-ai.apis-bj-devs.workers.dev/?Prompt=${encodeURIComponent(query)}`;
      
      const response = await axios.get(apiUrl, { 
        timeout: 60000, // 60 secondes pour la génération d'image
        headers: { 'Accept': 'application/json' }
      });

      // Supprimer le message de statut
      await bot.deleteMessage(chatId, statusMsg.message_id).catch(() => {});

      // Vérifier le statut de la réponse
      if (response.data.status !== 'success') {
        return bot.sendMessage(
          chatId,
          `❌ Erreur : ${response.data.message || 'Génération échouée'}`
        );
      }

      // Récupérer les URLs des images générées
      const images = response.data.result || [];
      
      if (images.length === 0) {
        return bot.sendMessage(chatId, '❌ Aucune image générée.');
      }

      // Envoyer les images (maximum 2 pour éviter le spam)
      for (let i = 0; i < Math.min(images.length, 2); i++) {
        const img = images[i];
        const caption = `🖼️ **${query}**\n📐 ${img.width}x${img.height}\n\n✨ Généré par SeaArt AI\n📱 @BJ_Devs | Support: @BJ_Coder`;
        
        await bot.sendPhoto(chatId, img.url, {
          caption: caption,
          parse_mode: 'Markdown'
        });
        
        // Pause entre chaque envoi
        if (i < images.length - 1) await new Promise(r => setTimeout(r, 1000));
      }

      // Message de crédits
      await bot.sendMessage(
        chatId,
        `✅ Image(s) générée(s) avec succès !\n` +
        `🔗 [Rejoindre @BJ_Devs](https://t.me/BJ_Devs) pour plus d'apis`,
        { 
          parse_mode: 'Markdown',
          disable_web_page_preview: true 
        }
      );

    } catch (error) {
      console.error('IMAGINE ERROR:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        return bot.sendMessage(chatId, '⏰ Le délai de génération est dépassé. Réessaie avec une description plus simple.');
      }
      
      bot.sendMessage(
        chatId,
        '❌ Erreur lors de la génération de l\'image.\n' +
        'Réessaie plus tard ou avec une autre description.'
      );
    }
  }
};