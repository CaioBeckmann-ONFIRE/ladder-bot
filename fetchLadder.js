const getToken = require('./getToken');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

module.exports = async function fetchLadderRanking() {
  const token = await getToken();

  const query = {
    query: `
      query {
        ladder(ladderId: "${process.env.LADDER_ID}") {
          name
          placementsPage(first: 10) {
            nodes {
              rank
              score
              user {
                username
              }
            }
          }
        }
      }
    `
  };

  const res = await fetch('https://publicapi.challengermode.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Erro na API:', res.status, errorText);
    return '❌ Erro ao buscar o ranking da Ladder.';
  }

  const data = await res.json();
  const ladderName = data.data.ladder.name;
  const players = data.data.ladder.placementsPage.nodes;

  let message = `**🏆 Ranking da Ladder ${ladderName}**\n\n`;

  players.forEach((entry, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${entry.rank}.**`;
    message += `${medal} ${entry.user.username} – ${entry.score} pts\n`;
  });

  const now = new Date();
  const dataFormatada = now.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  const horaFormatada = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit'
  });

  message += `\n📅 Atualizado em ${dataFormatada} às ${horaFormatada}`;
  return message;
};
