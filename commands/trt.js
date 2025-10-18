const axios = require('axios');

module.exports = {
  name: 'trt',
  description: 'Traduit du texte vers une langue cible',
  async execute(bot, msg) {
    try {
      const args = msg.text.split(' ').slice(1);

      if (args.length < 2) {
        await bot.sendMessage(msg.chat.id, "⛔ Utilise : /trt [code langue] [texte]", {
          reply_to_message_id: msg.message_id
        });
        return;
      }

      const targetLang = args[0];
      const textToTranslate = args.slice(1).join(' ');

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=auto|${targetLang}`;
      const response = await axios.get(url);
      const translation = response.data.responseData.translatedText;

      const message = `╭─⧉  𝙆𝙔𝙊𝙏𝘼𝙆𝘼 𝙏𝙍𝘼𝘿𝙐𝘾𝙏𝙄𝙊𝙉
│
│ 🗣️ 𝙏𝙚𝙭𝙩𝙚 : ${textToTranslate}
│ 🔁 𝙏𝙧𝙖𝙙𝙪𝙘𝙩𝙞𝙤𝙣 : ${translation}
│ 🌐 𝙇𝙖𝙣𝙜𝙪𝙚 : ${targetLang.toUpperCase()}
╰───────────────⸸`;

      await bot.sendMessage(msg.chat.id, message, {
        reply_to_message_id: msg.message_id
      });

    } catch (e) {
      console.log(e);
      await bot.sendMessage(msg.chat.id, "⚠️ Une erreur est survenue. Réessaie plus tard.", {
        reply_to_message_id: msg.message_id
      });
    }
  }
};