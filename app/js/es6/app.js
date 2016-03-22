import load from './load.js';

const app = {
  init() {
    const stage = new createjs.Stage('game-stage');

    load({ src: 'img/spritesheet.json', id: 'ss', type: 'spritesheet' }).then(queue => {
      stage.addChild(new createjs.Sprite(queue.getResult('ss'), 'playerShip1_orange.png'));
      stage.update();
    });
  },
};

app.init();
