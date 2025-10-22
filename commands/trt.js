const axios = require("axios");

module.exports = {
  name: "trt",
  description: "Traduit du texte vers une langue cible",
  async execute(bot, msg) {
    try {
      const args = msg.text.split(" ").slice(1);

      if (args.length < 2) {
        await bot.sendMessage(msg.chat.id, "⛔ Utilise : /trt [code langue] [texte]", {
          reply_to_message_id: msg.message_id,
        });
        return;
      }

      const targetLang = args[0].toUpperCase();
      const textToTranslate = args.slice(1).join(" ");

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        textToTranslate
      )}&langpair=EN|${targetLang}`;

      const response = await axios.get(url);
      let translation = response.data.responseData.translatedText;

      if (!translation || translation.includes("INVALID")) {
        translation = "⚠️ Impossible de traduire le texte. Vérifie le code langue.";
      }

      const message = `╭─⧉  𝘿𝙄𝙂𝙄𝙏𝘼𝙇 𝘾𝙍𝙀𝙒 243 𝙏𝙍𝘼𝘿𝙐𝘾𝙏𝙄𝙊𝙉
│
│ 🗣️  Texte : ${textToTranslate}
│ 🔁  Traduction : ${translation}
│ 🌐  Langue : ${targetLang}
╰───────────────⸸`;

      await bot.sendMessage(msg.chat.id, message, {
        reply_to_message_id: msg.message_id,
      });
    } catch (e) {
      console.log(e);
      await bot.sendMessage(msg.chat.id, "⚠️ Une erreur est survenue. Réessaie plus tard.", {
        reply_to_message_id: msg.message_id,
      });
    }
  },
};