const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  name: 'imageurl',
  description: 'Transforme une photo en lien Catbox',
  async execute(bot, msg) {
    if (!msg.reply_to_message || !msg.reply_to_message.photo) {
      return bot.sendMessage(msg.chat.id, '📸 Réponds à une image pour obtenir son URL.', { reply_to_message_id: msg.message_id });
    }

    const photos = msg.reply_to_message.photo;
    const fileId = photos[photos.length - 1].file_id;

    try {
      const fileLink = await bot.getFileLink(fileId);
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });

      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', response.data, 'image.jpg');

      const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders()
      });

      if (catboxRes.data) {
        bot.sendMessage(msg.chat.id, `🌐 URL Catbox : ${catboxRes.data}`, { reply_to_message_id: msg.message_id });
      } else {
        bot.sendMessage(msg.chat.id, '❌ Impossible de récupérer l’URL de cette image.', { reply_to_message_id: msg.message_id });
      }
    } catch (err) {
      bot.sendMessage(msg.chat.id, '❌ Impossible de récupérer l’URL de cette image.', { reply_to_message_id: msg.message_id });
    }
  }
};