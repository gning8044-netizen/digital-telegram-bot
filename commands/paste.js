const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'paste',
  description: 'Uploader du texte/code sur Pasty',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    let content = '';

    if (msg.reply_to_message) {
      if (msg.reply_to_message.text) {
        content = msg.reply_to_message.text;
      } else if (msg.reply_to_message.document) {
        const fileId = msg.reply_to_message.document.file_id;
        const fileLink = await bot.getFileLink(fileId);
        const fileExt = path.extname(msg.reply_to_message.document.file_name || '.txt').slice(1) || 'txt';
        
        const waitMsg = await bot.sendMessage(chatId, '📥 Téléchargement du fichier...');
        
        try {
          const fileRes = await axios.get(fileLink, { timeout: 10000 });
          content = fileRes.data;
          await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
        } catch (e) {
          return bot.sendMessage(chatId, '❌ Erreur lors du téléchargement du fichier.');
        }
      } else {
        return bot.sendMessage(chatId, '❌ Réponds à un message texte ou un fichier .txt');
      }
    } else if (args.length > 0) {
      content = args.join(' ');
    } else {
      return bot.sendMessage(
        chatId,
        '📋 **Paste Service**\n\n' +
        'Upload du texte/code sur Pasty.\n\n' +
        '**Utilisation :**\n' +
        '• `/paste console.log("hello")`\n' +
        '• Répondre à un message avec `/paste`\n' +
        '• Répondre à un fichier .txt/.py avec `/paste`',
        { parse_mode: 'Markdown' }
      );
    }

    if (!content || content.length < 10) {
      return bot.sendMessage(chatId, '❌ Le texte est trop court (minimum 10 caractères).');
    }

    if (content.length > 50000) {
      return bot.sendMessage(chatId, '❌ Le texte est trop long (maximum 50000 caractères).');
    }

    const waitMsg = await bot.sendMessage(chatId, '⏳ Upload vers Pasty...');

    try {
      const response = await axios.post(
        'https://pasty.lus.pm/api/v1/pastes',
        { content: content },
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.id) {
        const pasteId = response.data.id;
        const extension = msg.reply_to_message?.document?.file_name 
          ? path.extname(msg.reply_to_message.document.file_name).slice(1) 
          : 'txt';
        
        const pasteUrl = `https://pasty.lus.pm/${pasteId}.${extension}`;
        const rawUrl = `https://pasty.lus.pm/${pasteId}/raw`;

        await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

        await bot.sendMessage(
          chatId,
          `📋 **Paste réussi !**\n\n` +
          `🔗 **Lien :** [Clique ici](${pasteUrl})\n` +
          `📄 **Raw :** [Clique ici](${rawUrl})\n\n` +
          `✨ Généré par Alphaconnect\n` +
          `© Digital Crew 243`,
          {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🔗 Ouvrir le paste', url: pasteUrl },
                  { text: '📄 Raw', url: rawUrl }
                ]
              ]
            }
          }
        );
      } else {
        throw new Error('Réponse API invalide');
      }

    } catch (error) {
      console.error('PASTE ERROR:', error.message);
      
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      
      bot.sendMessage(
        chatId,
        '❌ Erreur lors de l\'upload vers Pasty.\n' +
        'Réessaie plus tard ou avec un autre texte.'
      );
    }
  }
};