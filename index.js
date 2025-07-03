const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const fetchLadderRanking = require('./fetchLadder');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);

  // Agendamento diário
  cron.schedule('0 10 * * *', async () => {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    const message = await fetchLadderRanking();
    channel.send(message);
  });
});

// Comando manual !ranking
client.on('messageCreate', async (message) => {
  if (message.content === '!ranking' && !message.author.bot) {
    const loadingMessage = await message.channel.send('🔄 Buscando ranking da Ladder...');
    const ranking = await fetchLadderRanking();
    await message.channel.send(ranking);
    await loadingMessage.delete();
  }
});




client.login(process.env.BOT_TOKEN);

