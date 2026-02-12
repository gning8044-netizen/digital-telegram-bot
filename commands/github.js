const axios = require('axios');

module.exports = {
  name: 'github',
  description: 'Rechercher des dépôts GitHub',

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ');

    if (!query) {
      return bot.sendMessage(
        chatId,
        '🐙 **GitHub Repository Search**\n\n' +
        'Recherche des dépôts GitHub.\n\n' +
        '**Utilisation :**\n' +
        '• `/github telegram bot`\n' +
        '• `/github pyrogram`\n' +
        '• `/github telegraf`',
        { parse_mode: 'Markdown' }
      );
    }

    const waitMsg = await bot.sendMessage(chatId, `🔍 Recherche de « ${query} » sur GitHub...`);

    try {
      const response = await axios.get(
        'https://api.github.com/search/repositories',
        {
          params: { q: query, per_page: 5 },
          timeout: 10000,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'TelegramBot/1.0'
          }
        }
      );

      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

      if (!response.data || response.data.total_count === 0) {
        return bot.sendMessage(chatId, `❌ Aucun dépôt trouvé pour « ${query} ».`);
      }

      const repos = response.data.items.slice(0, 5);
      
      let message = `🐙 **Résultats pour « ${query} »**\n\n`;
      
      for (let i = 0; i < repos.length; i++) {
        const repo = repos[i];
        message += `**${i + 1}.** [${repo.full_name}](${repo.html_url})\n`;
        message += `   ⭐ ${repo.stargazers_count}  🍴 ${repo.forks_count}  ⚠️ ${repo.open_issues}\n`;
        if (repo.description) {
          const desc = repo.description.length > 80 
            ? repo.description.substring(0, 80) + '...' 
            : repo.description;
          message += `   📝 ${desc}\n`;
        }
        message += '\n';
      }

      message += `\n✨ Généré par Alphaconnect\n© Digital Crew 243`;

      const keyboard = {
        inline_keyboard: repos.map(repo => [{
          text: `🔗 ${repo.full_name}`,
          url: repo.html_url
        }])
      };

      await bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: keyboard
      });

    } catch (error) {
      console.error('GITHUB ERROR:', error.message);
      
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      
      if (error.response?.status === 403) {
        return bot.sendMessage(chatId, '⚠️ Limite d\'API GitHub atteinte. Réessaie dans quelques minutes.');
      }
      
      bot.sendMessage(
        chatId,
        '❌ Erreur lors de la recherche GitHub.\n' +
        'Réessaie plus tard.'
      );
    }
  }
};