const axios = require('axios');

module.exports = {
  name: 'react',
  description: 'Envoyer des réactions à un post WhatsApp',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    
    if (!args[0]) {
      return bot.sendMessage(
        chatId,
        '📌 *Utilisation:* `/react <lien_whatsapp> [emojis]`\n\n' +
        '📌 *Exemples:*\n' +
        '`/react https://whatsapp.com/channel/0029VbCB5d0BA1f0svNBbe2V/100`\n' +
        '`/react https://whatsapp.com/channel/0029VbCB5d0BA1f0svNBbe2V/100 ❤️ 👍 🔥`\n\n' +
        '📌 *Emojis disponibles:* ❤️ 👍 🔥 🎉 😮 😢',
        { parse_mode: 'Markdown' }
      );
    }

    try {
      const channelLink = args[0];
      
      let emojis = ['❤️', '👍', '🔥'];
      
      if (args.length > 1) {
        emojis = args.slice(1).filter(emoji => 
          ['❤️', '👍', '🔥', '🎉', '😮', '😢'].includes(emoji)
        );
        if (emojis.length === 0) emojis = ['❤️', '👍', '🔥'];
      }
      
      emojis = emojis.slice(0, 3);
      
      const processingMsg = await bot.sendMessage(
        chatId,
        `⚡ *Digital Crew Reactions*\n\n` +
        `🔗 Lien: ${channelLink}\n` +
        `🎭 Réactions: ${emojis.join(' ')}\n\n` +
        `🔄 Envoi en cours...`,
        { parse_mode: 'Markdown' }
      );

      const API_KEY = 'ak_SLVGCboPHpV9f-2QEqvhL5RbfihwQt-A';
      
      const response = await axios.post(
        'https://easybooster.shop/api/v1/react',
        {
          channelLink: channelLink,
          emojis: emojis
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const data = response.data;
      
      if (data.success) {
        await bot.editMessageText(
          `✅ *RÉACTIONS ENVOYÉES*\n\n` +
          `📢 Post: ${channelLink}\n` +
          `🎭 Réactions: ${emojis.join(' ')}\n` +
          `🆔 ID: ${data.postId || 'N/A'}\n` +
          `📊 Status: ${data.message || 'Success'}\n\n` +
          `𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪`,
          {
            chat_id: chatId,
            message_id: processingMsg.message_id,
            parse_mode: 'Markdown'
          }
        );
      } else {
        await bot.editMessageText(
          `❌ *ÉCHEC*\n\n` +
          `📢 Post: ${channelLink}\n` +
          `🎭 Réactions: ${emojis.join(' ')}\n` +
          `📊 Erreur: ${data.message || 'Unknown error'}\n\n` +
          `𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪`,
          {
            chat_id: chatId,
            message_id: processingMsg.message_id,
            parse_mode: 'Markdown'
          }
        );
      }
      
    } catch (error) {
      console.error('REACT ERROR:', error.message);
      
      let errorMessage = '❌ Erreur inconnue';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = '⏱️ Timeout - API trop lente';
      } else if (error.response) {
        if (error.response.status === 401) {
          errorMessage = '🔑 API Key invalide';
        } else if (error.response.status === 404) {
          errorMessage = '🌍 API non trouvée';
        } else {
          errorMessage = `📡 Erreur API: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = '🔌 Pas de réponse du serveur';
      }
      
      bot.sendMessage(
        chatId,
        `❌ *ERREUR*\n\n${errorMessage}\n\n` +
        `Assurez-vous que:\n` +
        `1. Le lien WhatsApp est valide\n` +
        `2. Le post existe toujours\n` +
        `3. L'API est disponible\n\n` +
        `𓆩 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐰 𝟐𝟒𝟑 𓆪`,
        { parse_mode: 'Markdown' }
      );
    }
  }
};