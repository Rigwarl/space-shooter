import * as game from './game.js';
import load from './load.js';

const stage = new createjs.Stage('game-stage');
const cb = {
  width: stage.canvas.width,
  height: stage.canvas.height,
  get xCenter() {
    return this.width / 2;
  },
  get yCenter() {
    return this.height / 2;
  },
};

load({ src: 'img/spritesheet.json', id: 'ss', type: 'spritesheet' })
  .then(queue => {
    game.init({ ss: queue.getResult('ss'), stage, cb });
    setTicker();
  });

function setTicker() {
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.framerate = 30;
}
