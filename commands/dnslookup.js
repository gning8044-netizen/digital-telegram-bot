const dns = require('dns').promises;
const whois = require('whois-json');
const geoip = require('geoip-lite');

async function resolveDNS(domain) {
  let r = {};
  try { r.A = await dns.resolve(domain, 'A'); } catch {}
  try { r.AAAA = await dns.resolve(domain, 'AAAA'); } catch {}
  try { r.MX = await dns.resolve(domain, 'MX'); } catch {}
  try { r.TXT = await dns.resolve(domain, 'TXT'); } catch {}
  try { r.NS = await dns.resolve(domain, 'NS'); } catch {}
  try { r.CNAME = await dns.resolve(domain, 'CNAME'); } catch {}
  if (!r.A && !r.AAAA && !r.MX && !r.TXT && !r.NS && !r.CNAME) {
    try { r.ANY = await dns.resolve(domain, 'ANY'); } catch { return null; }
  }
  return r;
}

bot.onText(/\/dns (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const domain = match[1].replace(/https?:\/\//g, '').replace(/\/.*/g, '').trim();

  const dnsInfo = await resolveDNS(domain);
  if (!dnsInfo) return bot.sendMessage(chatId, "⚠️ Aucun enregistrement DNS trouvé.");

  let ip = dnsInfo.A ? dnsInfo.A[0] : dnsInfo.AAAA ? dnsInfo.AAAA[0] : null;
  let whoisInfo = ip ? await whois(domain).catch(()=>null) : null;
  let geo = ip ? geoip.lookup(ip) : null;

  let txt = `\`\`\`\nDomaine: ${domain}\n\`\`\``;

  if (dnsInfo.A) txt += `\nA: ${dnsInfo.A.join(', ')}`;
  if (dnsInfo.AAAA) txt += `\nAAAA: ${dnsInfo.AAAA.join(', ')}`;
  if (dnsInfo.MX) txt += `\nMX:\n${dnsInfo.MX.map(x=>` - ${x.exchange} (${x.priority})`).join('\n')}`;
  if (dnsInfo.NS) txt += `\nNS:\n${dnsInfo.NS.map(x=>` - ${x}`).join('\n')}`;
  if (dnsInfo.CNAME) txt += `\nCNAME:\n${dnsInfo.CNAME.join('\n')}`;
  if (dnsInfo.TXT) txt += `\nTXT:\n${dnsInfo.TXT.map(x=>` - ${x}`).join('\n')}`;
  if (dnsInfo.ANY) txt += `\nANY:\n${dnsInfo.ANY.map(x=>` - ${JSON.stringify(x)}`).join('\n')}`;

  if (ip) txt += `\n\nIP Source: ${ip}`;
  if (geo) txt += `\nPays: ${geo.country}\nVille: ${geo.city || "N/A"}\nRéseau: ${geo.org || "N/A"}`;

  if (whoisInfo && whoisInfo.asn) {
    txt += `\nASN: ${whoisInfo.asn}`;
    if (whoisInfo.org) txt += `\nOrganisation: ${whoisInfo.org}`;
  }

  bot.sendMessage(chatId, txt, { parse_mode: "Markdown" });
});
