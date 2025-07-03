const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

module.exports = async function fetchLadderRanking() {
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query)
  });

if (!res.ok) {
  const errorText = await res.text();
  console.error('Erro na API:', res.status, errorText);
  return `❌ Erro ${res.status}: ${errorText}`;
}

  const data = await res.json();
  const { name, placementsPage } = data.data.ladder;
  const players = placementsPage.nodes;

  let message = `**🏆 Ranking da Ladder ${name}**\n\n`;
  players.forEach((e, i) => {
    const prefix = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${e.rank}.**`;
    message += `${prefix} ${e.user.username} – ${e.score} pts\n`;
  });

  const now = new Date();
  message += `\n📅 Atualizado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`;
  return message;
};
