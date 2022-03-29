import Game from '../modules/Game.js';
import BlockResult from '../modules/BlockResult.js';
import ScoreElements from '../modules/ScoreElements.js';


const btnStartGame = document.querySelector("[data-start-game]");



const settings = {
    speedEnemy: 1,
    spawnTimeEnemies: 3000,
    speedProjectile: 7,
    playerDamage: 10,
    minHealthEnemy: 15,
    maxHealthEnemy: 40,

};



let GAME = new Game(settings);


btnStartGame.addEventListener('click', event => {
    event.stopPropagation()
    BlockResult.hiddenBlock();
    ScoreElements.update(0);
    GAME = new Game(settings);
    GAME.StartGame()
});

GAME.StartGame()



