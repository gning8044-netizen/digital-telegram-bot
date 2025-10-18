const fs = require('fs');
const path = require('path');
const http = require('http');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN || '8110943805:AAHi7nCotgNcQ3Epu7zAQG8xAstZREuT28k';
const channelUsername = process.env.CHANNEL_USERNAME || '@digitalcrew2';
const adminChatId = process.env.ADMIN_CHAT_ID || '6157845763';

module.exports.adminChatId = adminChatId;

const bot = new TelegramBot(token, { polling: true });

const usersFile = path.join(__dirname, 'users.json');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([], null, 2));

function saveUser(user) {
  const users = JSON.parse(fs.readFileSync(usersFile));
  const exists = users.find(u => u.id === user.id);
  if (!exists) {
    users.push(user);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  }
}

const commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name && typeof command.execute === 'function') commands.set(command.name, command);
}

async function checkSubscription(bot, userId) {
  try {
    const member = await bot.getChatMember(channelUsername, userId);
    return ['member', 'administrator', 'creator'].includes(member.status);
  } catch {
    return false;
  }
}

bot.on('message', async msg => {
  const chatId = msg.chat.id;
  const text = msg.text ? msg.text.trim() : '';

  const user = {
    id: msg.from.id,
    username: msg.from.username || "Inconnu",
    first_name: msg.from.first_name || "",
    last_name: msg.from.last_name || ""
  };

  saveUser(user);
  if (!text.startsWith('/')) return;

  const args = text.split(' ');
  const commandName = args[0].substring(1).toLowerCase();
  const command = commands.get(commandName);

  if (commandName === 'start') {
    const isSub = await checkSubscription(bot, user.id);
    if (!isSub) {
      return bot.sendMessage(chatId, '👋 Bienvenue ! Avant de continuer, rejoins notre canal officiel :', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Rejoindre le canal', url: `https://t.me/${channelUsername.replace('@', '')}` }],
            [{ text: '✅ J’ai rejoint', callback_data: 'verify_sub' }]
          ]
        }
      });
    }
    return bot.sendMessage(chatId, `✅ Bienvenue ${user.username}! Tape /help pour voir les commandes disponibles.`);
  }

  const isSub = await checkSubscription(bot, user.id);
  if (!isSub) {
    return bot.sendMessage(chatId, '🔒 Pour utiliser le bot, abonne-toi d’abord au canal ci-dessous :', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📢 Rejoindre le canal', url: `https://t.me/${channelUsername.replace('@', '')}` }],
          [{ text: '✅ J’ai rejoint', callback_data: 'verify_sub' }]
        ]
      }
    });
  }

  if (command) command.execute(bot, msg, args.slice(1));
  else bot.sendMessage(chatId, '❓ Commande inconnue.');
});

bot.on('callback_query', async query => {
  if (query.data === 'verify_sub') {
    const isSub = await checkSubscription(bot, query.from.id);
    if (isSub) {
      bot.answerCallbackQuery(query.id, { text: '✅ Abonnement vérifié. Tu peux maintenant utiliser le bot.' });
      bot.sendMessage(query.message.chat.id, 'Bienvenue, accès autorisé.');
    } else {
      bot.answerCallbackQuery(query.id, { text: '❌ Toujours pas abonné.' });
    }
  }
});

const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot en ligne');
}).listen(port);