const dns = require('dns').promises;

module.exports = {
  name: 'dnslookup',
  description: 'Recherche DNS avancée (A, AAAA, MX, TXT, NS, CNAME, SOA, SRV, PTR)',
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const input = (args || []).join(' ').trim();
    if (!input) {
      return bot.sendMessage(chatId, '🔎 Utilisation : /dnslookup [type] [domaine|ip]\nEx : /dnslookup example.com\nEx : /dnslookup mx example.com', { reply_to_message_id: msg.message_id });
    }

    const types = ['A','AAAA','MX','TXT','NS','CNAME','SOA','SRV','PTR','ANY'];
    let reqType = null;
    let target = input;

    const parts = input.split(/\s+/);
    if (parts.length >= 2 && types.includes(parts[0].toUpperCase())) {
      reqType = parts[0].toUpperCase();
      target = parts.slice(1).join(' ');
    }

    const isIp = /^[0-9.]+$/.test(target) || /^[0-9a-fA-F:]+$/.test(target);

    const results = [];
    const safeSend = async (text) => {
      const CHUNK = 4000;
      for (let i = 0; i < text.length; i += CHUNK) {
        await bot.sendMessage(chatId, text.substring(i, i + CHUNK), { reply_to_message_id: msg.message_id });
      }
    };

    try {
      if (reqType && reqType !== 'ANY') {
        if (reqType === 'PTR') {
          if (!isIp) return bot.sendMessage(chatId, '❗ Pour PTR fournissez une adresse IP.', { reply_to_message_id: msg.message_id });
          try {
            const ptr = await dns.reverse(target);
            results.push({ title: `PTR pour ${target}`, data: ptr });
          } catch (e) {
            results.push({ title: `PTR pour ${target}`, error: e.message });
          }
        } else {
          try {
            const r = await (reqType === 'SOA' ? dns.resolveSoa(target) : (reqType === 'ANY' ? dns.resolveAny(target) : dns.resolve(target, reqType)));
            results.push({ title: `${reqType} pour ${target}`, data: r });
            if (reqType === 'A' && Array.isArray(r) && r.length) {
              try {
                const rev = await dns.reverse(r[0]);
                results.push({ title: `Reverse PTR de ${r[0]}`, data: rev });
              } catch {}
            }
          } catch (e) {
            results.push({ title: `${reqType} pour ${target}`, error: e.message });
          }
        }
      } else {
        const queries = [
          ['A', async () => dns.resolve(target, 'A')],
          ['AAAA', async () => dns.resolve(target, 'AAAA')],
          ['MX', async () => dns.resolve(target, 'MX')],
          ['TXT', async () => dns.resolve(target, 'TXT')],
          ['NS', async () => dns.resolve(target, 'NS')],
          ['CNAME', async () => dns.resolve(target, 'CNAME')],
          ['SOA', async () => dns.resolveSoa(target)],
          ['SRV', async () => dns.resolve(target, 'SRV')],
          ['ANY', async () => dns.resolveAny(target)]
        ];

        const settled = await Promise.allSettled(queries.map(q => q[1]().then(res => ({ type: q[0], res }))));
        for (const s of settled) {
          if (s.status === 'fulfilled') {
            const { type, res } = s.value;
            results.push({ title: `${type} pour ${target}`, data: res });
            if (type === 'A' && Array.isArray(res) && res.length) {
              try {
                const rev = await dns.reverse(res[0]);
                results.push({ title: `Reverse PTR de ${res[0]}`, data: rev });
              } catch (e) {
                results.push({ title: `Reverse PTR de ${res[0]}`, error: e.message });
              }
            }
          } else {
            const reason = s.reason || s;
            const match = reason && reason.type ? reason.type : null;
            const typeName = match || 'UNKNOWN';
            results.push({ title: `${typeName}`, error: reason.message || String(reason) });
          }
        }

        if (isIp) {
          try {
            const rev = await dns.reverse(target);
            results.push({ title: `PTR pour ${target}`, data: rev });
          } catch (e) {
            results.push({ title: `PTR pour ${target}`, error: e.message });
          }
        }
      }

      let out = `🔎 Résultats DNS pour *${target}*`;
      if (reqType) out += ` (type: ${reqType})`;
      out += `\n\n`;

      for (const item of results) {
        out += `📘 ${item.title}\n`;
        if (item.error) {
          out += `❌ Erreur: ${item.error}\n\n`;
          continue;
        }
        if (Array.isArray(item.data)) {
          for (const entry of item.data) {
            out += `\`\`\`\n${typeof entry === 'object' ? JSON.stringify(entry, null, 2) : String(entry)}\n\`\`\`\n`;
          }
        } else if (typeof item.data === 'object') {
          out += `\`\`\`\n${JSON.stringify(item.data, null, 2)}\n\`\`\`\n`;
        } else {
          out += `\`\`\`\n${String(item.data)}\n\`\`\`\n`;
        }
      }

      await safeSend(out);
    } catch (err) {
      await bot.sendMessage(chatId, `⚠️ Erreur lors de la recherche DNS : ${err.message}`, { reply_to_message_id: msg.message_id });
    }
  }
};
