const axios = require('axios');

module.exports = {
  name: 'react',
  description: 'Réagir à une publication WhatsApp via API',
  
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const ADMIN_ID = 6157845763;
    
    if (userId !== ADMIN_ID) {
      return bot.sendMessage(chatId, '❌ Commande réservée à l\'administrateur.');
    }
    
    if (args.length < 2) {
      return bot.sendMessage(
        chatId,
        `🎯 Utilisation :\n/react <lien> <quantité>\n\nExemple :\n/react https://whatsapp.com/channel/0029Var87jIGJP8EXl0ce32T/946 10`,
        { parse_mode: 'Markdown' }
      );
    }
    
    const url = args[0];
    const quantity = parseInt(args[1]);
    
    if (!url.includes('whatsapp.com')) {
      return bot.sendMessage(chatId, '❌ Lien WhatsApp invalide.');
    }
    
    if (isNaN(quantity) || quantity <= 0) {
      return bot.sendMessage(chatId, '❌ Quantité invalide.');
    }
    
    try {
      const waitingMsg = await bot.sendMessage(
        chatId,
        `⏳ Envoi de ${quantity} réactions...\n\nLien : ${url}\n\n𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪`
      );
      
      const apiData = {
        key: 'adbe4541f1654519840d8eeb021d4abb9613838bfe411170cdc4b81bd9cb4c44',
        action: 'add',
        service: 1234,
        link: url,
        quantity: quantity
      };
      
      let response;
      
      try {
        response = await axios.post('https://blesspanel.store/api/v2.php', apiData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 30000
        });
      } catch (postError) {
        const getUrl = `https://blesspanel.store/api/v2.php?key=${apiData.key}&action=add&service=${apiData.service}&link=${encodeURIComponent(url)}&quantity=${quantity}`;
        
        response = await axios.get(getUrl, {
          timeout: 30000
        });
      }
      
      const data = response.data;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.order) {
        await bot.deleteMessage(chatId, waitingMsg.message_id);
        
        await bot.sendMessage(
          chatId,
          `✅ Commande #${data.order} créée !\n\n📊 Détails :\n🔗 Lien : ${url}\n🎯 Quantité : ${quantity}\n\n𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪`
        );
      } else {
        throw new Error('Réponse API invalide');
      }
      
    } catch (error) {
      console.error('REACT ERROR:', error.message);
      
      let errorMsg = '❌ Erreur :\n';
      
      if (error.message.includes('balance')) {
        errorMsg += 'Solde insuffisant';
      } else if (error.message.includes('Invalid')) {
        errorMsg += 'Clé API invalide';
      } else if (error.message.includes('service')) {
        errorMsg += 'Service non disponible';
      } else {
        errorMsg += error.message;
      }
      
      errorMsg += '\n\n𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪';
      
      await bot.sendMessage(chatId, errorMsg);
    }
  }
};