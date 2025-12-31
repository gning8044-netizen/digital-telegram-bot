module.exports = {
  name: 'uid',
  description: 'Affiche les informations d\'ID',
  async execute(bot, msg) {
    const user = msg.reply_to_message ? msg.reply_to_message.from : msg.from;
    const chat = msg.chat;
    
    const message = `
👤 <b>INFORMATIONS UTILISATEUR</b>

• <b>User ID</b>: <code>${user.id}</code>
• <b>Username</b>: ${user.username ? '@' + user.username : 'N/A'}
• <b>First Name</b>: ${user.first_name || 'N/A'}
• <b>Last Name</b>: ${user.last_name || ''}

💬 <b>INFORMATIONS CHAT</b>
• <b>Chat ID</b>: <code>${chat.id}</code>
• <b>Type</b>: ${chat.type}
${chat.title ? `• <b>Chat Title</b>: ${chat.title}` : ''}

📊 <b>AUTRES</b>
• <b>Message ID</b>: <code>${msg.message_id}</code>
• <b>Language</b>: ${user.language_code || 'N/A'}
    `;
    
    await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
  }
};