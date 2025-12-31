const axios = require("axios");

module.exports = {
  name: "tinfo",
  description: "Obtenir les informations d'un utilisateur TikTok",
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const input = args.join(" ").trim();

    if (!input) {
      return bot.sendMessage(chatId, "❌ Fournis un nom d'utilisateur TikTok.\nExemple: /tinfo username");
    }

    try {
      await bot.sendMessage(chatId, `🔍 Recherche @${input}...`);

      const response = await axios.get(
        `https://aryanx-apisx.onrender.com/tikstalk?username=${encodeURIComponent(input)}`,
        { timeout: 10000 }
      );

      const data = response.data;

      if (!data || !data.username) {
        return bot.sendMessage(chatId, "❌ Utilisateur non trouvé.");
      }

      const {
        nickname,
        username,
        avatarLarger,
        heartCount,
        followerCount,
        followingCount,
        videoCount,
        relation,
        signature,
        verified
      } = data;

      const caption = `
┌─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─┐
        ⚡ *TIKTOK INFO* ⚡
└─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─┘

┌─ • *PROFIL* •
│
├─ 📛 *Nickname*: ${nickname || 'N/A'}
├─ 🏷️ *Username*: @${username}
├─ ✅ *Verified*: ${verified ? 'Yes' : 'No'}
├─ 💬 *Bio*: ${signature || 'No bio'}
│
└─ • *STATISTIQUES* •
   ├─ ❤️ *Likes*: ${heartCount || '0'}
   ├─ 👥 *Followers*: ${followerCount || '0'}
   ├─ ➡️ *Following*: ${followingCount || '0'}
   ├─ 🎥 *Videos*: ${videoCount || '0'}
   └─ 🔗 *Relation*: ${relation || 'N/A'}

┌─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─┐
   📱 *Powered by Digital Crew*
└─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─┘
      `;

      try {
        const avatarRes = await axios.get(avatarLarger, { responseType: "arraybuffer", timeout: 8000 });
        await bot.sendPhoto(chatId, Buffer.from(avatarRes.data), { caption, parse_mode: "Markdown" });
      } catch (avatarError) {
        await bot.sendMessage(chatId, caption, { parse_mode: "Markdown" });
      }

    } catch (error) {
      console.error("TINFO ERROR:", error.message);
      
      if (error.code === 'ECONNABORTED') {
        return bot.sendMessage(chatId, "❌ Timeout. L'API TikTok est lente.");
      }
      
      try {
        const backupApi = await axios.get(`https://tikwm.com/api/user/info?unique_id=${encodeURIComponent(input)}`);
        if (backupApi.data && backupApi.data.data) {
          const user = backupApi.data.data;
          const backupCaption = `
📱 *TikTok Info*
┌─────────────────
│ 👤 @${user.unique_id}
│ 📛 ${user.nickname}
│ 👥 ${user.followers} followers
│ ➡️ ${user.following} following
│ 🎥 ${user.videoCount} videos
└─────────────────
          `;
          await bot.sendMessage(chatId, backupCaption, { parse_mode: "Markdown" });
        } else {
          bot.sendMessage(chatId, "❌ Erreur API TikTok.");
        }
      } catch {
        bot.sendMessage(chatId, "❌ Service TikTok indisponible.");
      }
    }
  }
};