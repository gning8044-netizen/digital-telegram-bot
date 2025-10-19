module.exports = {
  name: 'myid',
  description: 'Renvoie ton ID Telegram',
  async execute(bot, msg) {
    const userId = msg.from.id;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || 'Inconnu';

    await bot.sendMessage(msg.chat.id, `👤 Ton ID Telegram : \`${userId}\`\nNom/Username : ${username}`, {
      parse_mode: 'Markdown'
    });
  }
};