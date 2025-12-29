const os = require('os');
const util = require('util');
const { adminChatId } = require('../index.js');

module.exports = {
  name: 'uptime',
  description: 'Informations système avancées',
  async execute(bot, msg) {
    try {
      const startTime = Date.now();
      
      // Calculs
      const uptime = process.uptime();
      const formatUptime = (seconds) => {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${d}j ${h}h ${m}m ${s}s`;
      };
      
      const mem = process.memoryUsage();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      
      // Informations utilisateur
      const user = msg.from;
      const chat = msg.chat;
      const botInfo = await bot.getMe();
      
      // Création du message avec design
      const message = `
╔══════════════════════════════════════╗
           🔷 *DIGITAL CREW BOT* 🔷
╚══════════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            👤 USER INFO              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
├─ 📛 *Name*: ${user.first_name || ''} ${user.last_name || ''}
├─ 🆔 *Username*: ${user.username ? '@' + user.username : 'N/A'}
├─ 🔢 *User ID*: \`${user.id}\`
├─ 💬 *Chat Type*: ${chat.type}
├─ 🏷️ *Chat ID*: \`${chat.id}\`

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            🤖 BOT STATUS             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
├─ ⚡ *Bot*: @${botInfo.username}
├─ ⏱️ *Uptime*: ${formatUptime(uptime)}
├─ 👑 *Admin*: \`${adminChatId}\`
├─ 🚀 *Version*: Node.js ${process.version}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            📊 RESOURCES              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
├─ 🧠 *RAM Total*: ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB
├─ 📈 *RAM Used*: ${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB (${((usedMem / totalMem) * 100).toFixed(1)}%)
├─ 💾 *Process RAM*: ${(mem.rss / 1024 / 1024).toFixed(2)} MB
├─ ⚙️ *CPU Cores*: ${os.cpus().length}
├─ 🔥 *CPU Model*: ${os.cpus()[0].model.split(' ')[0]}
├─ 🖥️ *Platform*: ${os.platform()} (${os.arch()})
├─ 🏠 *Hostname*: ${os.hostname()}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            📈 PERFORMANCE            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
├─ 📦 *Heap Used*: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB
├─ 🗃️ *Heap Total*: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB
├─ 🎯 *External*: ${(mem.external / 1024 / 1024).toFixed(2)} MB
├─ 🚀 *Response*: ${Date.now() - startTime}ms

╔══════════════════════════════════════╗
        🕐 ${new Date().toLocaleTimeString('fr-FR')}
╚══════════════════════════════════════╝
      `;
      
      await bot.sendMessage(msg.chat.id, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_to_message_id: msg.message_id
      });
      
    } catch (error) {
      console.error('Erreur sysinfo:', error);
      bot.sendMessage(msg.chat.id, '⚠️ Impossible de récupérer les informations système.');
    }
  }
};