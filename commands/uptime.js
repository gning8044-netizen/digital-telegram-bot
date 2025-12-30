const os = require('os');

module.exports = {
  name: 'uptime',
  description: 'Affiche le temps depuis lequel le bot est en ligne',
  async execute(bot, msg) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memPercent = (((totalMem - freeMem) / totalMem) * 100).toFixed(1);
    
    const user = msg.from;
    const userName = user.first_name || user.username || 'User';
    
    const message = `
⚡ *BOT STATUS*

• *USER*
├─ 👤 ${userName}
├─ 🆔 \`${user.id}\`
└─ 💬 ${msg.chat.type}

• *SYSTEM*
├─ ⏱️ ${days}d ${hours}h ${minutes}m
├─ 🧠 RAM: ${memPercent}% used
├─ 📊 Free: ${(freeMem / 1024 / 1024 / 1024).toFixed(1)}GB
└─ ⚙️ CPU: ${os.cpus().length} cores

• *PERFORMANCE*
├─ 📦 ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)}MB
└─ 🚀 ${process.version}

_🕐 ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}_
    `;
    
    await bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
  }
};