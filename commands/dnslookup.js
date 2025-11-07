const dns = require("dns").promises;
const axios = require("axios");
const net = require("net");

module.exports = {
  name: "dnslookup",
  description: "Analyse DNS + WHOIS + ASN + Géolocalisation + SPF + CDN + Ports",
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const domain = (args || []).join(" ").trim();
    if (!domain) return bot.sendMessage(chatId, "🔎 Utilisation : /dnslookup [domaine]");

    const sendChunk = async (text) => {
      const size = 3900;
      for (let i = 0; i < text.length; i += size) {
        await bot.sendMessage(chatId, text.slice(i, i + size), { parse_mode: "Markdown" });
      }
    };

    let out = `🌐 *Analyse complète du domaine* \`${domain}\`\n\n`;

    try {
      const A = await dns.resolve(domain, "A");
      const ip = A[0];
      out += `📌 *Adresse IP*\n\`\`\`bash\n${A.join("\n")}\n\`\`\`\n`;

      try {
        const whois = await axios.get(`https://api.bgpview.io/ip/${ip}`);
        const d = whois.data.data;
        out += `🏢 *Réseau & ASN*\n\`\`\`bash\nASN: ${d.asn.asn}\nOrganisation: ${d.asn.name}\nRéseau: ${d.asn.description}\n\`\`\`\n`;
      } catch {}

      try {
        const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
        out += `🌍 *Localisation*\n\`\`\`bash\n${geo.data.city}, ${geo.data.country_name}\nFournisseur: ${geo.data.org}\n\`\`\`\n`;
      } catch {}

      try {
        const txt = await dns.resolve(domain, "TXT");
        const spf = txt.flat().find(v => v.includes("v=spf"));
        const dmarc = (await dns.resolve(`_dmarc.${domain}`, "TXT")).flat().find(v => v.includes("v=DMARC"));
        out += `🛡️ *SPF / DMARC*\n\`\`\`bash\nSPF: ${spf || "Aucun"}\nDMARC: ${dmarc || "Aucun"}\n\`\`\`\n`;
      } catch {
        out += `🛡️ SPF / DMARC\n\`\`\`bash\nNon trouvés\n\`\`\`\n`;
      }

      try {
        const cname = await dns.resolveCname(domain).catch(() => null);
        if (cname && cname.some(v => v.includes("cloudflare"))) out += `🟠 *CDN détecté : Cloudflare*\n\n`;
        if (cname && cname.some(v => v.includes("fastly"))) out += `🟣 *CDN détecté : Fastly*\n\n`;
        if (cname && cname.some(v => v.includes("akamai"))) out += `🔵 *CDN détecté : Akamai*\n\n`;
      } catch {}

      const ports = { 80: "HTTP", 443: "HTTPS", 21: "FTP", 22: "SSH", 25: "SMTP", 3306: "MySQL" };
      out += `🔍 *Scan de ports (non agressif)*\n\`\`\`bash\n`;
      const check = (port) => new Promise(resolve => {
        const s = net.createConnection(port, ip);
        s.setTimeout(800);
        s.on("connect", () => { s.destroy(); resolve(`${port} (${ports[port]}) : OUVERT`); });
        s.on("timeout", () => { s.destroy(); resolve(`${port} (${ports[port]}) : FERME`); });
        s.on("error", () => resolve(`${port} (${ports[port]}) : FERME`));
      });
      const results = await Promise.all(Object.keys(ports).map(p => check(Number(p))));
      out += results.join("\n") + `\n\`\`\`\n`;

      await sendChunk(out);

    } catch {
      bot.sendMessage(chatId, "❌ Domaine invalide ou injoignable.");
    }
  }
};
