const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN || 'TON_TOKEN_ICI';
const bot = new TelegramBot(token, { polling: true });

const commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name && typeof command.execute === 'function') commands.set(command.name, command);
}

bot.on('message', msg => {
  const text = msg.text ? msg.text.trim() : '';
  if (!text.startsWith('/')) return;
  const args = text.split(' ');
  const commandName = args[0].substring(1).toLowerCase();
  const command = commands.get(commandName);
  if (command) command.execute(bot, msg, args.slice(1));
  else bot.sendMessage(msg.chat.id, 'Commande inconnue.');
});

const port = process.env.PORT || 3000;
require('http').createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot en ligne');
}).listen(port);