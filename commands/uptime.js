const os = require('os');
const fs = require('fs');
const path = require('path');
const { adminChatId } = require('../index.js');

module.exports = {
  name: 'uptime',
  description: 'Affiche les statistiques détaillées du bot',
  async execute(bot, msg) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = ((usedMem / totalMem) * 100).toFixed(1);
    
    const user = msg.from;
    const userName = user.username ? `@${user.username}` : user.first_name || 'Utilisateur';
    
    let userPhotoUrl = '';
    try {
      const photos = await bot.getUserProfilePhotos(user.id);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const file = await bot.getFile(fileId);
        userPhotoUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      }
    } catch (error) {
      console.log('Photo non disponible');
    }
    
    const cpus = os.cpus();
    const cpuModel = cpus[0].model;
    const cpuCores = cpus.length;
    
    let botUsername = '';
    try {
      const botInfo = await bot.getMe();
      botUsername = botInfo.username;
    } catch (error) {
      botUsername = 'Bot';
    }
    
    let totalUsers = 0;
    let activeUsers = 0;
    let bannedUsers = 0;
    
    try {
      const usersFile = path.join(__dirname, '../users.json');
      if (fs.existsSync(usersFile)) {
        const usersData = fs.readFileSync(usersFile, 'utf8');
        const users = JSON.parse(usersData);
        if (Array.isArray(users)) {
          totalUsers = users.length;
          bannedUsers = users.filter(u => u && u.banned).length;
          activeUsers = totalUsers - bannedUsers;
        }
      }
    } catch (error) {}
    
    const message = `
┌─────────────────────────────┐
         ⚡ *SYSTEM STATUS* ⚡
└─────────────────────────────┘

• *BOT INFORMATION*
├─ 🤖 Bot: @${botUsername}
├─ 👑 Admin: \`${adminChatId}\`
├─ ⏱️ Uptime: ${days}j ${hours}h ${minutes}m ${seconds}s

• *USER STATS*
├─ 👤 User: ${userName}
├─ 🆔 ID: \`${user.id}\`
├─ 💬 Chat: ${msg.chat.type}
├─ 👥 Users: ${totalUsers} (✅${activeUsers} 🚫${bannedUsers})

• *SYSTEM RESOURCES*
├─ 🧠 RAM: ${(usedMem / 1024 / 1024 / 1024).toFixed(1)}GB/${(totalMem / 1024 / 1024 / 1024).toFixed(1)}GB
├─ 📈 Usage: ${memUsage}%
├─ ⚙️ CPU: ${cpuModel.split(' ')[0]}
├─ 🎯 Cores: ${cpuCores}
├─ 🖥️ OS: ${os.platform()}

• *PERFORMANCE*
├─ 🚀 Node.js: ${process.version}
├─ 📦 Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)}MB
└─ 📊 Heap: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)}MB

⏰ ${new Date().toLocaleTimeString('fr-FR')}
    `;
    
    if (userPhotoUrl) {
      await bot.sendPhoto(msg.chat.id, userPhotoUrl, {
        caption: message,
        parse_mode: 'Markdown'
      });
    } else {
      await bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    }
  }
};