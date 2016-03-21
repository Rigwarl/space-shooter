const app = {
  init() {
    const stage = new createjs.Stage('game-stage');
    const queue = new createjs.LoadQueue();
    queue.loadFile({ src: 'img/spritesheet.json', id: 'ss', type: 'spritesheet' });
    queue.on('complete', () => {
      const ss = queue.getResult('ss');
      stage.addChild(new createjs.Sprite(ss, 'playerShip1_orange'));
      stage.update();
    });
  },
};

app.init();
