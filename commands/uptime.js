module.exports = {
  name: 'uptime',
  description: 'Affiche le temps depuis lequel le bot est en ligne',
  execute(bot, msg) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    bot.sendMessage(
      msg.chat.id,
      `⏱ Uptime du bot : ${hours}h ${minutes}m ${seconds}s`
    );
  }
};