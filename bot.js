require('dotenv').config()
const { Telegraf } = require('telegraf')
const fs = require('fs')
const { getDomains } = require('./functions/cloudflare')

const bot = new Telegraf(process.env.BOT_TOKEN)
let config = require('./config.json')

bot.start((ctx) => {
  ctx.reply(`🧠 Selamat datang di Cloudflare DNS Bot!`, {
    reply_markup: {
      keyboard: [
        ['+ Add Subdomain', '🎲 Add Random'],
        ['☁️ Add Cloudflare Config', '🗑️ Delete Cloudflare Config'],
        ['🗑️ Delete Domain', '📋 Detail Cloudflare']
      ],
      resize_keyboard: true
    }
  })
})

bot.hears('☁️ Add Cloudflare Config', (ctx) => {
  ctx.reply('Masukkan Email dan API Key kamu dengan format:\n`email|apikey`', { parse_mode: 'Markdown' })
})

bot.on('text', async (ctx) => {
  const userId = ctx.from.id.toString()
  const text = ctx.message.text

  if (text.includes('|')) {
    const [email, apikey] = text.split('|')
    config[userId] = { email, apikey }
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
    return ctx.reply('✅ Cloudflare config berhasil disimpan!')
  }

  if (text === '📋 Detail Cloudflare') {
    if (!config[userId]) return ctx.reply('❌ Belum ada konfigurasi Cloudflare. Gunakan ☁️ Add Cloudflare Config')
    const data = await getDomains(config[userId])
    return ctx.reply(data)
  }
})

bot.launch()