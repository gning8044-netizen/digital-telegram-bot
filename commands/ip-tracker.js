module.exports = {
  name: 'unsend',
  description: 'Supprime le message auquel tu réponds',
  async execute(bot, msg) {
    if (!msg.reply_to_message) {
      return bot.sendMessage(msg.chat.id, "❌ Réponds à un message.");
    }

    try {
      await bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
      await bot.deleteMessage(msg.chat.id, msg.message_id);
    } catch (error) {
      bot.sendMessage(msg.chat.id, "❌ Erreur de suppression.");
    }
  }
};