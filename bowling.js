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
        if (firstRoll === 10) { // Strike
          score += 10 + this.getStrikeBonus(i);
        } else if (firstRoll + secondRoll === 10) { // Spare
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
      if (nextFrame[0] === 10) { // Next frame is also a strike
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

  console.log("Joueurs enregistrés:", players.map(player => player.name).join(", "));
}

startGame();
