const os = require('os');
const { adminChatId } = require('../index.js');

module.exports = {
  name: 'uptime',
  description: 'Affiche le temps depuis lequel le bot est en ligne',
  async execute(bot, msg) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercent = ((usedMem / totalMem) * 100).toFixed(1);
    
    const user = msg.from;
    const userName = user.first_name || user.username || 'Utilisateur';
    const userTag = user.username ? `@${user.username}` : `ID: ${user.id}`;
    
    const cpuCount = os.cpus().length;
    const cpuModel = os.cpus()[0].model.split(' ')[0];
    const platform = os.platform();
    const arch = os.arch();
    
    const message = `
⚡ *DIGITAL CREW STATUS*

┌─ *USER INFO*
│ 👤 ${userName}
│ 🏷️ ${userTag}
│ 💬 ${msg.chat.type}
│ 🆔 \`${user.id}\`
└─

┌─ *SYSTEM UPTIME*
│ ⏱️ ${days}d ${hours}h ${minutes}m ${seconds}s
│ 🧠 RAM: ${memPercent}% (${(freeMem / 1024 / 1024 / 1024).toFixed(1)}GB free)
│ ⚙️ CPU: ${cpuCount}× ${cpuModel}
│ 🖥️ ${platform}/${arch}
└─

┌─ *PERFORMANCE*
│ 📦 Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)}MB
│ 🚀 Node: ${process.version}
│ 👑 Admin: \`${adminChatId}\`
└─

_🕐 ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}_
    `;
    
    await bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
  }
};