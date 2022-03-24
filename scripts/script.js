import Game from '../modules/Game.js';



const settings = {
    speedEnemy: 1,
    spawnTimeEnemies: 2000,
    speedProjectile: 5,
    playerDamage: 10,
    
    minHealthEnemy:10,
    maxHealthEnemy:30,

};



const GAME = new Game(settings);


GAME.StartGame()



