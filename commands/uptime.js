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
    
    const message = `
╔══════════════════════════════╗
       🚀 *BOT STATUS* 🚀
╚══════════════════════════════╝

▸ *👤 User*: ${userName}
▸ *🆔 ID*: \`${user.id}\`
▸ *💬 Chat*: ${msg.chat.type}

╭━━━━━━━━━━━━━━━━━━━━━━━━━╮
│     📊 SYSTEM INFO      │
├─────────────────────────┤
│ ⏱️ *Uptime*: ${days}d ${hours}h ${minutes}m ${seconds}s
│ 🧠 *RAM*: ${memPercent}% used
│ 📊 *Free*: ${(freeMem / 1024 / 1024 / 1024).toFixed(1)}GB
│ ⚙️ *CPU*: ${os.cpus().length} cores
│ 🖥️ *OS*: ${os.platform()} ${os.arch()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━━━━━━━━━━━╮
│     🔧 PERFORMANCE      │
├─────────────────────────┤
│ 📦 *Memory*: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)}MB
│ 🚀 *Node*: ${process.version}
│ 👑 *Admin*: \`${adminChatId}\`
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯

⏰ ${new Date().toLocaleTimeString('fr-FR')}
    `;
    
    await bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
  }
};