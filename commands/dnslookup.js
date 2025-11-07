const dns = require('dns').promises;
const axios = require('axios');

module.exports = {
  name: 'dnslookup',
  description: 'Recherche DNS avancée + WHOIS + ASN + Géolocalisation serveur + infos réseau',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const domain = (args || []).join(" ").trim();
    if (!domain) return bot.sendMessage(chatId, "🔎 Utilisation : /dnslookup [domaine]", { reply_to_message_id: msg.message_id });

    const safeSend = async (text) => {
      const CHUNK = 3800;
      for (let i = 0; i < text.length; i += CHUNK) {
        await bot.sendMessage(chatId, text.substring(i, i + CHUNK), { parse_mode: 'Markdown' });
      }
    };

    let output = `🌐 *Analyse complète du domaine* \`${domain}\`\n\n`;

    try {
      let aRecord = await dns.resolve(domain, 'A');
      output += `📌 *Adresse IPv4*\n\`\`\`bash\n${aRecord.join('\n')}\n\`\`\`\n`;

      let ipv6Record = [];
      try { ipv6Record = await dns.resolve(domain, 'AAAA'); } catch {}
      if (ipv6Record.length) output += `📌 *Adresse IPv6*\n\`\`\`bash\n${ipv6Record.join('\n')}\n\`\`\`\n`;

      let cnameRecord = [];
      try { cnameRecord = await dns.resolve(domain, 'CNAME'); } catch {}
      if (cnameRecord.length) output += `🔗 *CNAME*\n\`\`\`bash\n${cnameRecord.join('\n')}\n\`\`\`\n`;

      const ip = aRecord[0];

      try {
        const whois = await axios.get(`https://api.bgpview.io/ip/${ip}`);
        const data = whois.data.data;
        output += `🏢 *ASN / Hébergeur*\n\`\`\`bash\nASN: ${data.asn.asn}\nOrganisation: ${data.asn.name}\nRéseau: ${data.asn.description}\n\`\`\`\n`;
      } catch { output += `⚠️ Impossible de récupérer ASN.\n\n`; }

      try {
        const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
        output += `🌍 *Localisation serveur*\n\`\`\`bash\nPays: ${geo.data.country_name}\nVille: ${geo.data.city}\nFournisseur: ${geo.data.org}\nLatitude: ${geo.data.latitude}\nLongitude: ${geo.data.longitude}\n\`\`\`\n`;
      } catch { output += `⚠️ Échec géolocalisation.\n\n`; }

      const types = ['NS', 'MX', 'TXT', 'SOA', 'PTR', 'SPF'];
      for (const type of types) {
        try {
          const rec = await dns.resolve(domain, type);
          output += `📑 *Enregistrements ${type}*\n\`\`\`bash\n${JSON.stringify(rec, null, 2)}\n\`\`\`\n`;
        } catch {}
      }

      await safeSend(output);

    } catch {
      bot.sendMessage(chatId, `❌ Domaine invalide ou inaccessible.`);
    }
  }
};
