module.exports = {
  name: 'ping',
  description: 'Vérifie la réactivité du bot',
  async execute(bot, msg) {
    const start = Date.now();
    const sent = await bot.sendMessage(msg.chat.id, 'Pong 🏓...');
    const latency = Date.now() - start;
    bot.editMessageText(`🏓 Pong ! Latence : ${latency} ms`, {
      chat_id: sent.chat.id,
      message_id: sent.message_id
    });
  }
};