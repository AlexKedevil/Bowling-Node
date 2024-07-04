const prompt = require('prompt-sync')({ sigint: true });

class Player {
    constructor(name) {
      this.name = name;
      this.frames = Array.from({ length: 10 }, () => [null, null]);
      this.extraRolls = [];
    }
  
    roll(frameIndex, rollIndex, pins) {
      if (frameIndex < 10) {
        this.frames[frameIndex][rollIndex] = pins;
      } else {
        this.extraRolls.push(pins);
      }
    }
  
    calculateScore() {
      let score = 0;
      for (let i = 0; i < 10; i++) {
        const [firstRoll, secondRoll] = this.frames[i];
        if (firstRoll === 10) {
          score += 10 + this.getStrikeBonus(i);
        } else if (firstRoll + secondRoll === 10) {
          score += 10 + this.getSpareBonus(i);
        } else {
          score += firstRoll + secondRoll;
        }
      }
      return score + this.extraRolls.reduce((sum, roll) => sum + roll, 0);
    }
  
    getStrikeBonus(frameIndex) {
      const nextFrame = this.frames[frameIndex + 1] || [];
      const nextNextFrame = this.frames[frameIndex + 2] || [];
      if (nextFrame[0] === 10) {
        return 10 + (nextNextFrame[0] || this.extraRolls[0] || 0);
      } else {
        return (nextFrame[0] || 0) + (nextFrame[1] || 0);
      }
    }
  
    getSpareBonus(frameIndex) {
      const nextFrame = this.frames[frameIndex + 1] || [];
      return nextFrame[0] || this.extraRolls[0] || 0;
    }
  }

  function startGame() {
    console.log("Démarrez une nouvelle partie de bowling.");
    const numPlayers = parseInt(prompt("Entrez le nombre de joueurs: "));
    
    if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 6) {
      console.log("Le nombre de joueurs doit être un nombre entre 1 et 6.");
      return;
    }
  
    const players = [];
    for (let i = 0; i < numPlayers; i++) {
      let name = '';
      do {
        name = prompt(`Entrez le nom du joueur ${i + 1}: `);
        if (/^\d+$/.test(name)) {
          console.log("Le nom ne peut pas être composé uniquement de chiffres. Veuillez réessayer.");
        }
      } while (/^\d+$/.test(name));
  
      players.push(new Player(name));
    }
  
    for (let frameIndex = 0; frameIndex < 10; frameIndex++) {
      for (let rollIndex = 0; rollIndex < 2; rollIndex++) {
        players.forEach(player => {
          if (frameIndex === 9 && (player.frames[frameIndex][0] === 10 || player.frames[frameIndex].reduce((a, b) => a + b, 0) === 10)) {
            const extraRollsCount = player.frames[frameIndex][0] === 10 ? 2 : 1;
            for (let extraRoll = 0; extraRoll < extraRollsCount; extraRoll++) {
              let pins = NaN;
              do {
                pins = parseInt(prompt(`${player.name}, lancer supplémentaire ${extraRoll + 1}: Combien de quilles avez-vous renversé ? `));
                if (isNaN(pins) || pins < 0 || pins > 10) {
                  console.log("Nombre invalide de quilles renversées. Veuillez entrer un nombre entre 0 et 10.");
                }
              } while (isNaN(pins) || pins < 0 || pins > 10);
  
              player.roll(10, extraRoll, pins);
            }
          } else {
            if (rollIndex === 1 && player.frames[frameIndex][0] === 10) {
              return;
            }
            let pins = NaN;
            do {
              pins = parseInt(prompt(`${player.name}, Frame ${frameIndex + 1}, lancer ${rollIndex + 1}. Combien de quilles avez-vous renversé ? `));
              if (isNaN(pins) || pins < 0 || pins > 10) {
                console.log("Nombre invalide de quilles renversées. Veuillez entrer un nombre entre 0 et 10.");
              }
            } while (isNaN(pins) || pins < 0 || pins > 10);
  
            player.roll(frameIndex, rollIndex, pins);
          }
        });
      }
      console.log("Score après le frame", frameIndex + 1);
      players.forEach(player => {
        console.log(`${player.name}: ${player.calculateScore()}`);
      });
    }
  
    console.log("Score final:");
    players.forEach(player => {
      console.log(`${player.name}: ${player.calculateScore()}`);
    });
  
    const highestScore = Math.max(...players.map(player => player.calculateScore()));
    const winners = players.filter(player => player.calculateScore() === highestScore);
  
    if (winners.length > 1) {
      console.log("Les gagnants sont:", winners.map(player => player.name).join(", "));
    } else {
      console.log("Le gagnant est:", winners[0].name);
    }
  }
  
  startGame();
  