const axios = require("axios");

module.exports = {
  name: "ai",
  description: "Discute avec l’IA Kyotaka",
  async execute(bot, msg, args) {
    const question = args.join(" ");
    if (!question) {
      return bot.sendMessage(msg.chat.id, "⚠️ Utilise : /ai [ta question]", {
        reply_to_message_id: msg.message_id,
      });
    }

    try {
      const response = await axios.post("https://kyotaka-dark-gpt-api-zf9c.vercel.app/api/chat", {
        message: question,
      });

      const reply = response.data.response || "🤖 Aucune réponse reçue.";

      await bot.sendMessage(msg.chat.id, `💬 *Question :* ${question}\n\n🤖 *Réponse :* ${reply}`, {
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id,
      });
    } catch (error) {
      console.error("Erreur IA :", error.message);
      await bot.sendMessage(
        msg.chat.id,
        "⚠️ Une erreur est survenue lors de la communication avec l’IA.",
        { reply_to_message_id: msg.message_id }
      );
    }
  },
};