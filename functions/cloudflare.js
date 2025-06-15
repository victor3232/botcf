const axios = require('axios')

async function getDomains({ email, apikey }) {
  try {
    const res = await axios.get('https://api.cloudflare.com/client/v4/zones', {
      headers: {
        'X-Auth-Email': email,
        'X-Auth-Key': apikey,
        'Content-Type': 'application/json'
      }
    })

    if (res.data.success) {
      const list = res.data.result.map(zone => `• ${zone.name}`).join('\n')
      return `📋 Daftar domain terhubung:\n${list}`
    } else {
      return '❌ Gagal mengambil data domain.'
    }
  } catch (err) {
    return '⚠️ Error: ' + err.message
  }
}

module.exports = { getDomains }