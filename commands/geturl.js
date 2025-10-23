const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  name: 'fileurl',
  description: 'Transforme une photo, GIF ou vidéo en lien Catbox',
  async execute(bot, msg) {
    const reply = msg.reply_to_message;
    if (!reply || (!reply.photo && !reply.document && !reply.video)) {
      return bot.sendMessage(msg.chat.id, '📸 Réponds à une image, GIF ou vidéo pour obtenir son URL.', { reply_to_message_id: msg.message_id });
    }

    let fileId;
    let fileName = 'file';

    if (reply.photo) {
      const photos = reply.photo;
      fileId = photos[photos.length - 1].file_id;
      fileName += '.jpg';
    } else if (reply.video) {
      fileId = reply.video.file_id;
      fileName += '.mp4';
    } else if (reply.document) {
      fileId = reply.document.file_id;
      fileName += reply.document.file_name ? `_${reply.document.file_name}` : '.dat';
    }

    try {
      const fileLink = await bot.getFileLink(fileId);
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });

      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', response.data, fileName);

      const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders()
      });

      if (catboxRes.data) {
        bot.sendMessage(msg.chat.id, `🌐 URL Catbox : ${catboxRes.data}`, { reply_to_message_id: msg.message_id });
      } else {
        bot.sendMessage(msg.chat.id, '❌ Impossible de récupérer l’URL.', { reply_to_message_id: msg.message_id });
      }
    } catch {
      bot.sendMessage(msg.chat.id, '❌ Impossible de récupérer l’URL.', { reply_to_message_id: msg.message_id });
    }
  }
};