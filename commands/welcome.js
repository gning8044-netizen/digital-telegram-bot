module.exports = {
  name: 'welcome',
  description: 'Souhaite la bienvenue aux nouveaux membres du groupe',
  
  async groupHandler(bot, msg) {
    const chat = msg.chat;
    const newMembers = msg.new_chat_members;

    if (!newMembers || newMembers.length === 0) return;

    for (const member of newMembers) {
      if (member.is_bot) continue; // ignore les bots
      const name = member.first_name || member.username || "nouveau membre";
      const groupName = chat.title || "ce groupe";
      const desc = (await bot.getChat(chat.id)).description || "Aucune description disponible";

      const message = `🎉 Bienvenue *${name}* dans *${groupName}* !\n📝 Description : ${desc}`;
      await bot.sendMessage(chat.id, message, { parse_mode: 'Markdown' });
    }
  },

  async execute(bot, msg) {
    await bot.sendMessage(msg.chat.id, '✅ Le système de bienvenue est activé pour ce groupe.');
  }
};