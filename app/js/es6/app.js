import game from './game.js';
import load from './load.js';

const stage = new createjs.Stage('game-stage');
const cb = {
  width: stage.canvas.width,
  height: stage.canvas.height,
};

load({ src: 'img/spritesheet.json', id: 'ss', type: 'spritesheet' })
  .then(queue => game.init({ ss: queue.getResult('ss'), stage, cb }));

createjs.Ticker.addEventListener('tick', () => stage.update());
createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
createjs.Ticker.setFPS(20);
