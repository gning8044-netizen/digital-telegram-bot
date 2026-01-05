const axios = require('axios');

module.exports = {
  name: 'wa',
  description: 'WhatsApp Reactions',
  async execute(bot, msg, args) {
    if (!args[0]) {
      return bot.sendMessage(msg.chat.id, 
        '📌 Usage: /wa <whatsapp_link>\n' +
        '📌 Example: /wa https://whatsapp.com/channel/...\n' +
        '📌 Emojis: ❤️ 👍 🔥'
      );
    }

    const channelLink = args[0];
    
    await bot.sendMessage(msg.chat.id, `⚡ Sending reactions to: ${channelLink.substring(0, 50)}...`);
    
    try {
      const result = await axios.post(
        'https://easybooster.shop/api/v1/react',
        {
          channelLink: channelLink,
          emojis: ['❤️', '👍', '🔥']
        },
        {
          headers: {
            'Authorization': 'Bearer ak_SLVGCboPHpV9f-2QEqvhL5RbfihwQt-A',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (result.data.success) {
        bot.sendMessage(msg.chat.id, `✅ Success! Reactions sent.\nPost: ${result.data.postId || 'N/A'}`);
      } else {
        bot.sendMessage(msg.chat.id, `❌ Failed: ${result.data.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      bot.sendMessage(msg.chat.id, `❌ Error: ${error.message}`);
    }
  }
};