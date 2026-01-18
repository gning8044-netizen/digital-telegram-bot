const axios = require("axios");

module.exports = {
  name: "ai",
  description: "Discute avec l'IA Digital Crew 243",
  async execute(bot, msg, args) {
    const question = args.join(" ");
    if (!question) {
      return bot.sendMessage(msg.chat.id, "⚠️ Utilise : /ai [ta question]", {
        reply_to_message_id: msg.message_id,
      });
    }

    await bot.sendChatAction(msg.chat.id, "typing");

    const apiUrl = "https://digital-dark-api.netlify.app/.netlify/functions/api";
    let reply = "";

    try {
      const postData = { prompt: question };
      
      try {
        const postRes = await axios.post(apiUrl, postData, {
          timeout: 25000,
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (postRes.data && postRes.data.response) {
          reply = postRes.data.response;
        } else if (postRes.data && typeof postRes.data === 'string') {
          reply = postRes.data;
        }
      } catch (postError) {
        const getRes = await axios.get(`${apiUrl}?prompt=${encodeURIComponent(question)}`, {
          timeout: 25000
        });
        
        if (getRes.data && getRes.data.response) {
          reply = getRes.data.response;
        } else if (getRes.data && typeof getRes.data === 'string') {
          reply = getRes.data;
        }
      }

      if (!reply) {
        reply = "🤖 Aucune réponse reçue.";
      }

      reply = reply.replace(/\*/g, '');
      
      const fullMessage = `💬 *Question :* ${question}\n\n🤖 *Digital Crew 243 :*\n${reply}`;

      const CHUNK_SIZE = 3900;
      for (let i = 0; i < fullMessage.length; i += CHUNK_SIZE) {
        const part = fullMessage.substring(i, i + CHUNK_SIZE);
        await bot.sendMessage(msg.chat.id, part, {
          parse_mode: "Markdown",
          reply_to_message_id: msg.message_id
        });
      }

    } catch (error) {
      console.error("Erreur IA:", error.message);
      
      let errorMsg = "⚠️ Erreur de connexion à l'IA";
      if (error.code === 'ECONNABORTED') {
        errorMsg = "⏰ Timeout - Réessaie";
      } else if (error.response?.status === 429) {
        errorMsg = "🚫 Trop de requêtes. Patientez.";
      }
      
      await bot.sendMessage(
        msg.chat.id,
        errorMsg,
        { reply_to_message_id: msg.message_id }
      );
    }
  },
};