module.exports = {
  name: 'unsend',
  aliases: ['u', 'uns', 'delete'],
  description: 'Supprime un message en y répondant',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const replyToMessage = msg.reply_to_message;

    if (!replyToMessage) {
      return bot.sendMessage(chatId, "❌ Réponds à un message pour le supprimer.\nExemple: /unsend (en réponse à un message)");
    }

    try {
      let deleteOwnMessage = true;
      
      if (args[0] === 'keep') {
        deleteOwnMessage = false;
      }
      
      await bot.deleteMessage(chatId, replyToMessage.message_id);
      
      if (deleteOwnMessage) {
        setTimeout(async () => {
          try {
            await bot.deleteMessage(chatId, msg.message_id);
          } catch (e) {
            console.log('Commande non supprimée');
          }
        }, 800);
      } else {
        await bot.sendMessage(chatId, "✅ Message supprimé.", { reply_to_message_id: msg.message_id });
      }
      
    } catch (error) {
      console.error('UNSEND ERROR:', error.message);
      
      let errorMessage = "❌ Impossible de supprimer ce message.";
      
      if (error.response?.body?.description) {
        const desc = error.response.body.description;
        
        if (desc.includes("message can't be deleted")) {
          errorMessage = "❌ Le message est trop vieux (plus de 48h) ou n'a pas été envoyé par le bot.";
        } else if (desc.includes("not enough rights")) {
          errorMessage = "❌ Le bot doit être administrateur avec la permission de supprimer les messages.";
        } else if (desc.includes("message to delete not found")) {
          errorMessage = "❌ Le message a déjà été supprimé ou n'existe plus.";
        }
      }
      
      await bot.sendMessage(chatId, errorMessage);
    }
  }
};