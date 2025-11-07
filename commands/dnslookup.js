const dns = require('dns').promises;
const axios = require('axios');

module.exports = {
  name: 'dnslookup',
  description: 'Recherche DNS avancée + WHOIS + ASN + Géolocalisation serveur (optimisé, parallèle)',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const input = (args || []).join(" ").trim();
    if (!input) return bot.sendMessage(chatId, "🔎 Utilisation : /dnslookup [domaine ou URL]", { reply_to_message_id: msg.message_id });

    let domain;
    try { domain = new URL(input).hostname; } 
    catch { domain = input.replace(/^https?:\/\//, '').split('/')[0]; }

    const safeSend = async (text) => {
      const CHUNK = 3800;
      for (let i = 0; i < text.length; i += CHUNK) {
        await bot.sendMessage(chatId, text.substring(i, i + CHUNK), { parse_mode: 'Markdown' });
      }
    };

    let output = `🌐 *Analyse complète du domaine* \`${domain}\`\n\n`;

    try {
      const dnsPromises = {
        A: dns.resolve(domain, 'A').catch(() => []),
        AAAA: dns.resolve(domain, 'AAAA').catch(() => []),
        CNAME: dns.resolve(domain, 'CNAME').catch(() => []),
        NS: dns.resolve(domain, 'NS').catch(() => []),
        MX: dns.resolve(domain, 'MX').catch(() => []),
        TXT: dns.resolve(domain, 'TXT').catch(() => []),
        SOA: dns.resolve(domain, 'SOA').catch(() => []),
        PTR: dns.resolve(domain, 'PTR').catch(() => []),
        SPF: dns.resolve(domain, 'SPF').catch(() => [])
      };

      const dnsResults = await Promise.all(Object.values(dnsPromises));
      const keys = Object.keys(dnsPromises);
      const records = {};
      keys.forEach((k, i) => records[k] = dnsResults[i]);

      if (records.A.length) output += `📌 *Adresse IPv4*\n\`\`\`bash\n${records.A.join('\n')}\n\`\`\`\n`;
      if (records.AAAA.length) output += `📌 *Adresse IPv6*\n\`\`\`bash\n${records.AAAA.join('\n')}\n\`\`\`\n`;
      if (records.CNAME.length) output += `🔗 *CNAME*\n\`\`\`bash\n${records.CNAME.join('\n')}\n\`\`\`\n`;

      const ip = records.A[0];

      const apiPromises = {
        whois: ip ? axios.get(`https://api.bgpview.io/ip/${ip}`).catch(() => null) : null,
        geo: ip ? axios.get(`https://ipapi.co/${ip}/json/`).catch(() => null) : null
      };

      const [whoisResp, geoResp] = await Promise.all(Object.values(apiPromises));

      if (whoisResp?.data?.data) {
        const data = whoisResp.data.data;
        output += `🏢 *ASN / Hébergeur*\n\`\`\`bash\nASN: ${data.asn.asn}\nOrganisation: ${data.asn.name}\nRéseau: ${data.asn.description}\n\`\`\`\n`;
      } else output += `⚠️ Impossible de récupérer ASN.\n\n`;

      if (geoResp?.data) {
        const geo = geoResp.data;
        output += `🌍 *Localisation serveur*\n\`\`\`bash\nPays: ${geo.country_name}\nVille: ${geo.city}\nFournisseur: ${geo.org}\nLatitude: ${geo.latitude}\nLongitude: ${geo.longitude}\n\`\`\`\n`;
      } else output += `⚠️ Échec géolocalisation.\n\n`;

      const dnsTypes = ['NS', 'MX', 'TXT', 'SOA', 'PTR', 'SPF'];
      dnsTypes.forEach(type => {
        if (records[type]?.length) output += `📑 *Enregistrements ${type}*\n\`\`\`bash\n${JSON.stringify(records[type], null, 2)}\n\`\`\`\n`;
      });

      await safeSend(output);

    } catch {
      bot.sendMessage(chatId, `❌ Domaine invalide ou inaccessible.`);
    }
  }
};
