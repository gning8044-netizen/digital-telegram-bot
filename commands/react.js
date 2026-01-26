const axios = require('axios');

module.exports = {
  name: 'react',
  description: 'Réagir à une publication WhatsApp via API BlessPanel',
  
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    
    // Vérifier si l'utilisateur a fourni l'URL et le nombre de réactions
    if (args.length < 2) {
      return bot.sendMessage(
        chatId,
        `🎯 *Utilisation :*\n\`/react <lien_whatsapp> <nombre> <emoji>\`\n\n*Exemple :*\n\`/react https://whatsapp.com/channel/0029Var87jIGJP8EXl0ce32T/946 10 🎯\`\n\n𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪`,
        { parse_mode: 'Markdown' }
      );
    }
    
    // Extraire les arguments
    const url = args[0];
    const quantity = parseInt(args[1]);
    const emoji = args[2] || '🎯'; // Emoji par défaut
    
    // Validation des données
    if (!url.includes('whatsapp.com')) {
      return bot.sendMessage(chatId, '❌ *Lien invalide !* Fournis un lien WhatsApp valide.', { parse_mode: 'Markdown' });
    }
    
    if (isNaN(quantity) || quantity <= 0) {
      return bot.sendMessage(chatId, '❌ *Quantité invalide !* Fournis un nombre positif.', { parse_mode: 'Markdown' });
    }
    
    if (quantity > 50) {
      return bot.sendMessage(chatId, '⚠️ *Quantité limitée !* Maximum 50 réactions par commande.', { parse_mode: 'Markdown' });
    }
    
    try {
      // Envoyer un message d'attente
      const waitingMsg = await bot.sendMessage(
        chatId,
        `⏳ *Envoi des réactions...*\n\n📤 Lien : \`${url}\`\n🎯 Nombre : ${quantity}\n😊 Emoji : ${emoji}\n\n𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪`,
        { parse_mode: 'Markdown' }
      );
      
      // Configuration API BlessPanel
      const apiConfig = {
        method: 'post', // Essayer POST d'abord
        url: 'https://blesspanel.store/api/v2.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        data: {
          key: '93d207b737b54506403b8a5a805b18fe0739ed2f63b699ccdb78d325909603b0',
          action: 'react',
          url: url,
          quantity: quantity,
          emoji: emoji
        },
        timeout: 30000 // 30 secondes timeout
      };
      
      let response;
      
      try {
        // Essayer avec POST
        response = await axios(apiConfig);
      } catch (postError) {
        console.log('POST failed, trying GET...');
        
        // Essayer avec GET
        apiConfig.method = 'get';
        apiConfig.params = {
          key: '93d207b737b54506403b8a5a805b18fe0739ed2f63b699ccdb78d325909603b0',
          action: 'react',
          url: url,
          quantity: quantity,
          emoji: emoji
        };
        delete apiConfig.data;
        
        response = await axios(apiConfig);
      }
      
      // Vérifier la réponse
      if (!response.data) {
        throw new Error('Pas de réponse de l\'API');
      }
      
      // Analyser la réponse
      const data = response.data;
      
      // Vérifier différents formats de réponse possibles
      let message = '';
      let success = false;
      
      if (data.status === 'success' || data.success === true) {
        success = true;
        message = data.message || '✅ Réactions envoyées avec succès !';
      } else if (data.error) {
        message = `❌ Erreur : ${data.error}`;
      } else if (data.message) {
        message = data.message;
        success = data.message.toLowerCase().includes('success') || 
                 data.message.toLowerCase().includes('réussi') ||
                 data.message.toLowerCase().includes('envoyé');
      } else {
        message = '✅ Action terminée !';
        success = true;
      }
      
      // Supprimer le message d'attente
      try {
        await bot.deleteMessage(chatId, waitingMsg.message_id);
      } catch (e) {}
      
      // Envoyer le résultat
      const resultMessage = success ? 
        `✅ *Succès !*\n\n${message}\n\n📊 *Détails :*\n🔗 Lien : \`${url}\`\n🎯 Quantité : ${quantity}\n😊 Emoji : ${emoji}\n\n𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪` :
        `❌ *Échec !*\n\n${message}\n\n𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪`;
      
      await bot.sendMessage(chatId, resultMessage, { parse_mode: 'Markdown' });
      
    } catch (error) {
      console.error('REACT ERROR:', error.message);
      
      // Message d'erreur détaillé
      let errorMsg = '❌ *Erreur lors de l\'envoi des réactions*\n\n';
      
      if (error.response) {
        // Erreur de réponse HTTP
        errorMsg += `*Code :* ${error.response.status}\n`;
        if (error.response.data) {
          errorMsg += `*Réponse :* ${JSON.stringify(error.response.data)}\n`;
        }
      } else if (error.request) {
        // Pas de réponse
        errorMsg += '*Aucune réponse du serveur API*\n';
        errorMsg += 'Vérifie ta connexion ou l\'état du service.\n';
      } else {
        // Erreur de configuration
        errorMsg += `*Erreur :* ${error.message}\n`;
      }
      
      errorMsg += '\n𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪';
      
      await bot.sendMessage(chatId, errorMsg, { parse_mode: 'Markdown' });
    }
  }
};