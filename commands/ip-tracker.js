module.exports = {
  name: 'unsend',
  description: 'Supprime le message auquel tu réponds',
  async execute(bot, msg) {
    const reply = msg.reply_to_message;
    
    if (!reply) {
      return bot.sendMessage(msg.chat.id, "❌ Réponds à un message.");
    }
    
    try {
      await bot.deleteMessage(msg.chat.id, reply.message_id);
      await bot.deleteMessage(msg.chat.id, msg.message_id);
    } catch (error) {
      bot.sendMessage(msg.chat.id, "❌ Impossible de supprimer.");
    }
  }
};