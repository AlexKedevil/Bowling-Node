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

    players.push({ name, score: 0 });
  }

  console.log("Joueurs enregistrés:", players.map(player => player.name).join(", "));
}

startGame();
