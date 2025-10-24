const axios = require("axios");

module.exports = {
  name: "img",
  description: "Génère une image à partir d'une description.",
  async execute(bot, msg, args) {
    const query = args.join(" ");
    if (!query) {
      return bot.sendMessage(msg.chat.id, "🖼️ Utilisation : /img [description de l’image]");
    }

    const apiKey = "YOUR_API_KEY";
    const url = `https://api.lolhuman.xyz/api/ai-image?apikey=${apiKey}&text=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");
      await bot.sendPhoto(msg.chat.id, buffer, { caption: `🧠 Image générée pour : "${query}"` });
    } catch (err) {
      console.error(err);
      bot.sendMessage(msg.chat.id, "⚠️ Impossible de générer l’image pour le moment.");
    }
  }
};