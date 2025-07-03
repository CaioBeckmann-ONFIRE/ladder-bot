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

// Proteção contra múltiplas respostas
const responded = new Set();

// Quando o bot estiver online
client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);

  // Envio automático diário às 10h UTC
  cron.schedule('0 10 * * *', async () => {
    try {
      const channel = await client.channels.fetch(process.env.DAILY_RANKING_CHANNEL_ID);
      const message = await fetchLadderRanking();
      await channel.send(message);
    } catch (error) {
      console.error('Erro ao enviar ranking diário:', error);
    }
  });
});

// Comando manual !ranking (somente no canal de comandos)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.COMMANDS_CHANNEL_ID) return;
  if (message.content !== '!ranking') return;

  // Verifica se essa mensagem já foi respondida
  const hash = `${message.channel.id}-${message.id}`;
  if (responded.has(hash)) return;
  responded.add(hash);

  try {
    const loadingMessage = await message.channel.send('🔄 Buscando ranking da Ladder...');
    const ranking = await fetchLadderRanking();
    await message.channel.send(ranking);
    await loadingMessage.delete();
  } catch (error) {
    console.error('Erro no comando !ranking:', error);
    message.channel.send('❌ Ocorreu um erro ao buscar o ranking.');
  }
});

client.login(process.env.BOT_TOKEN);
