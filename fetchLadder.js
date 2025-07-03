module.exports = async function fetchLadderRanking() {
  const fakePlayers = [
    { username: 'Jogador1', points: 1200 },
    { username: 'Jogador2', points: 1150 },
    { username: 'Jogador3', points: 1100 },
    { username: 'Jogador4', points: 1075 },
    { username: 'Jogador5', points: 1050 },
    { username: 'Jogador6', points: 1000 },
    { username: 'Jogador7', points: 980 },
    { username: 'Jogador8', points: 960 },
    { username: 'Jogador9', points: 940 },
    { username: 'Jogador10', points: 920 }
  ];

  let message = '**🏆 Ranking da Ladder ExitLag Champs Ladder**\n\n';

  fakePlayers.forEach((player, i) => {
    let prefix = '';
    if (i === 0) prefix = '🥇';
    else if (i === 1) prefix = '🥈';
    else if (i === 2) prefix = '🥉';
    else prefix = `**${i + 1}.**`;

    message += `${prefix} ${player.username} – ${player.points} pts\n`;
  });

  const now = new Date();
  const data = now.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  const hora = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit'
  });

  message += `\n📅 Atualizado em ${data} às ${hora}`;
  return message;
};
