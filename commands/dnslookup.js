const dns = require('dns').promises;
const axios = require('axios');

module.exports = {
  name: 'dnslookup',
  description: 'Recherche DNS avancée + WHOIS + ASN + Géolocalisation serveur',
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
      // ====== 1) DNS A Record ======
      let aRecord = await dns.resolve(domain, 'A');
      output += `📌 *Adresse IP :*\n\`\`\`bash\n${aRecord.join('\n')}\n\`\`\`\n`;

      const ip = aRecord[0]; // On garde la première

      // ====== 2) WHOIS / ASN via BGPView ======
      try {
        const whois = await axios.get(`https://api.bgpview.io/ip/${ip}`);
        const data = whois.data.data;

        output += `🏢 *Détails réseau (ASN / Hébergeur)*\n\`\`\`bash\nASN: ${data.asn.asn}\nOrganisation: ${data.asn.name}\nRéseau: ${data.asn.description}\n\`\`\`\n`;
      } catch {
        output += `⚠️ Impossible de récupérer ASN.\n\n`;
      }

      // ====== 3) Géolocalisation serveur ======
      try {
        const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
        output += `🌍 *Localisation du serveur*\n\`\`\`bash\nPays: ${geo.data.country_name}\nVille: ${geo.data.city}\nFournisseur: ${geo.data.org}\n\`\`\`\n`;
      } catch {
        output += `⚠️ Échec géolocalisation.\n\n`;
      }

      // ====== 4) DNS avancé ======
      const checks = ['NS', 'MX', 'TXT', 'SOA'];
      for (const type of checks) {
        try {
          const rec = await dns.resolve(domain, type);
          output += `📑 *Enregistrements ${type}*\n\`\`\`bash\n${JSON.stringify(rec, null, 2)}\n\`\`\`\n`;
        } catch {}
      }

      await safeSend(output);

    } catch (e) {
      bot.sendMessage(chatId, `❌ Domaine invalide ou inaccessible.`);
    }
  }
};
