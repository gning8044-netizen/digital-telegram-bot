const axios = require("axios");

module.exports = {
  name: "ai",
  description: "Discute avec l’IA sans censure Digital Crew 243",
  async execute(bot, msg, args) {
    const question = args.join(" ");
    if (!question) {
      return bot.sendMessage(msg.chat.id, "⚠️ Utilise : /ai [ta question]", {
        reply_to_message_id: msg.message_id,
      });
    }

    await bot.sendChatAction(msg.chat.id, "typing");

    try {
      const res = await axios.get(
        `https://kyotaka-dark-gpt-api-zf9c.vercel.app/api/chat?prompt=${encodeURIComponent(question)}`
      );
      const reply = res.data || "🤖 Aucune réponse reçue.";

      const fullMessage = `💬 *Question :* ${question}\n\n🤖 *Digital Crew 243 :* ${reply}`;

      
      const CHUNK_SIZE = 4000;
      for (let i = 0; i < fullMessage.length; i += CHUNK_SIZE) {
        const part = fullMessage.substring(i, i + CHUNK_SIZE);
        await bot.sendMessage(msg.chat.id, part, {
          parse_mode: "Markdown",
          reply_to_message_id: msg.message_id
        });
      }

    } catch (error) {
      console.error("Erreur IA :", error.message);
      await bot.sendMessage(
        msg.chat.id,
        `⚠️ Une erreur est survenue lors de la communication avec l’IA.\n${error.message}`,
        { reply_to_message_id: msg.message_id }
      );
    }
  },
};