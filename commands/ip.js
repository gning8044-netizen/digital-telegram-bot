const axios = require('axios');

module.exports = {
  name: 'ip',
  description: "Récupère les infos d'une IP ou d'un domaine (utilise ip-api.com)",
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const query = args.join(' ').trim();
    if (!query) {
      return bot.sendMessage(chatId, '❌ Utilisation : /ip [adresse IP ou domaine]', { reply_to_message_id: msg.message_id });
    }

    try {
      const url = `http://ip-api.com/json/${encodeURIComponent(query)}?fields=status,message,query,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,reverse,mobile,proxy,hosting,offset,continent,continentCode`;
      const res = await axios.get(url, { timeout: 10000 });
      const d = res.data;

      if (!d || d.status !== 'success') {
        const errMsg = d && d.message ? d.message : 'Impossible de récupérer les informations.';
        return bot.sendMessage(chatId, `❌ Erreur : ${errMsg}`, { reply_to_message_id: msg.message_id });
      }

      const lines = [];
      lines.push(`📡 Informations pour \`${d.query}\``);
      lines.push('');
      lines.push(`🌍 Continent : ${d.continent || 'N/A'} (${d.continentCode || 'N/A'})`);
      lines.push(`🏳️ Pays : ${d.country || 'N/A'} (${d.countryCode || 'N/A'})`);
      lines.push(`🧭 Région : ${d.regionName || d.region || 'N/A'}`);
      lines.push(`🏙️ Ville : ${d.city || 'N/A'} · Code postal : ${d.zip || 'N/A'}`);
      lines.push(`📍 Coordonnées : ${d.lat || 'N/A'}, ${d.lon || 'N/A'}`);
      if (d.lat && d.lon) lines.push(`🗺️ Carte : https://www.openstreetmap.org/?mlat=${d.lat}&mlon=${d.lon}#map=12/${d.lat}/${d.lon}`);
      lines.push(`⏱️ Fuseau horaire : ${d.timezone || 'N/A'} (offset ${d.offset !== undefined ? d.offset : 'N/A'})`);
      lines.push('');
      lines.push(`🔧 FAI / ASN : ${d.isp || 'N/A'}`);
      lines.push(`🏢 Organisation : ${d.org || 'N/A'}`);
      lines.push(`🆔 AS : ${d.as || d.asname || 'N/A'}`);
      lines.push('');
      lines.push(`🔁 Reverse DNS : ${d.reverse || 'N/A'}`);
      lines.push(`📱 Mobile : ${d.mobile ? 'Oui' : 'Non'}`);
      lines.push(`🛡️ Proxy : ${d.proxy ? 'Oui' : 'Non'}`);
      lines.push(`📦 Hébergement : ${d.hosting ? 'Oui' : 'Non'}`);

      const message = lines.join('\n');

      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown', reply_to_message_id: msg.message_id, disable_web_page_preview: true });
    } catch (err) {
      await bot.sendMessage(chatId, '⚠️ Erreur lors de la requête. Réessaie plus tard.', { reply_to_message_id: msg.message_id });
    }
  }
};