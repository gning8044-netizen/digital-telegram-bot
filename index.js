const fs = require('fs');
const path = require('path');
const http = require('http');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN || 'TON_TOKEN_ICI';
const channelUsername = process.env.CHANNEL_USERNAME || '@TON_CANAL_ICI';

const bot = new TelegramBot(token, { polling: true });

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
  if (!text.startsWith('/')) return;

  const args = text.split(' ');
  const commandName = args[0].substring(1).toLowerCase();
  const command = commands.get(commandName);

  if (commandName !== 'start') {
    const isSub = await checkSubscription(bot, msg.from.id);
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
  }

  if (command) command.execute(bot, msg, args.slice(1));
  else bot.sendMessage(chatId, 'Commande inconnue.');
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