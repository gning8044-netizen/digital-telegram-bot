const os = require('os');
const fs = require('fs');
const path = require('path');
const { adminChatId } = require('../index.js');

module.exports = {
  name: 'uptime',
  description: 'Affiche les statistiques détaillées du bot',
  async execute(bot, msg) {
    try {
      // Calcul uptime
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      
      // Informations système
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsage = ((usedMem / totalMem) * 100).toFixed(2);
      
      // Informations utilisateur
      const user = msg.from;
      const userName = user.username 
        ? `@${user.username}` 
        : user.first_name || 'Utilisateur';
      
      const userId = user.id;
      const chatType = msg.chat.type;
      const chatId = msg.chat.id;
      
      // Récupérer la photo de profil
      let userPhotoUrl = '';
      try {
        const photos = await bot.getUserProfilePhotos(userId, { limit: 1 });
        if (photos.total_count > 0) {
          const fileId = photos.photos[0][0].file_id;
          const file = await bot.getFile(fileId);
          userPhotoUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
        }
      } catch (error) {
        console.error('Erreur photo profil:', error.message);
      }
      
      // Informations CPU
      const cpus = os.cpus();
      const cpuModel = cpus[0].model;
      const cpuCores = cpus.length;
      const cpuUsage = os.loadavg()[0].toFixed(2);
      
      // Informations plateforme
      const platform = os.platform();
      const arch = os.arch();
      const hostname = os.hostname();
      
      // Informations bot
      const botInfo = await bot.getMe();
      const botUsername = botInfo.username;
      
      // Informations users.json
      const usersFile = path.join(__dirname, '../users.json');
      let totalUsers = 0;
      let activeUsers = 0;
      let bannedUsers = 0;
      
      if (fs.existsSync(usersFile)) {
        try {
          const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
          totalUsers = users.length;
          bannedUsers = users.filter(u => u.banned).length;
          activeUsers = totalUsers - bannedUsers;
        } catch (error) {
          console.error('Erreur lecture users.json:', error);
        }
      }
      
      // Créer le message formaté
      const message = `
┌─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─┐
   ⚡ *SYSTEM STATUS* ⚡
└─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─┘

┌─ • *BOT INFORMATION* •
│
├─ 🤖 *Bot:* @${botUsername}
├─ 👑 *Admin:* \`${adminChatId}\`
├─ 📊 *Uptime:* ${days}j ${hours}h ${minutes}m ${seconds}s
│
└─ • *USER STATS* •
   ├─ 👤 *Utilisateur:* ${userName}
   ├─ 🆔 *ID:* \`${userId}\`
   ├─ 💬 *Chat:* ${chatType} (\`${chatId}\`)
   └─ 👥 *Total Users:* ${totalUsers} (✅ ${activeUsers} | 🚫 ${bannedUsers})

┌─ • *SYSTEM RESOURCES* •
│
├─ 🧠 *RAM:* ${(usedMem / 1024 / 1024 / 1024).toFixed(2)}GB/${(totalMem / 1024 / 1024 / 1024).toFixed(2)}GB
├─ 📈 *Usage:* ${memUsage}%
├─ ⚙️ *CPU:* ${cpuModel}
├─ 🎯 *Cores:* ${cpuCores}
├─ 📊 *Load:* ${cpuUsage}
├─ 🖥️ *OS:* ${platform} (${arch})
└─ 🏠 *Host:* ${hostname}

┌─ • *PERFORMANCE* •
│
├─ 🚀 *Node.js:* ${process.version}
├─ 📦 *Memory RSS:* ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB
├─ 📈 *Heap Used:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
└─ 📊 *Heap Total:* ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)}MB

┌─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─┐
   ⏰ *Last Update:* ${new Date().toLocaleTimeString('fr-FR')}
└─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─╾╼─┘
      `;
      
      // Options d'envoi avec ou sans photo
      const options = {
        parse_mode: 'Markdown',
        reply_to_message_id: msg.message_id
      };
      
      if (userPhotoUrl) {
        // Envoyer avec photo de profil
        await bot.sendPhoto(msg.chat.id, userPhotoUrl, {
          caption: message,
          parse_mode: 'Markdown',
          reply_to_message_id: msg.message_id
        });
      } else {
        // Envoyer sans photo
        await bot.sendMessage(msg.chat.id, message, options);
      }
      
    } catch (error) {
      console.error('Erreur commande uptime:', error);
      bot.sendMessage(msg.chat.id, '❌ Erreur lors de la récupération des statistiques.');
    }
  }
};