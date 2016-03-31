import collisions from './collisions.js';
import camera from './camera.js';
import Hero from './elements/hero.js';
import Enemy from './elements/enemy.js';
import Meteor from './elements/meteor.js';
import Target from './elements/target.js';
import ai from './ai.js';

let ss;
let cb;
let stage;
let ls;
let hero;
let lb;
let ticks = 0;

export default {
  init(args) {
    ss = args.ss;
    cb = args.cb;
    stage = args.stage;

    start();
    createjs.Ticker.addEventListener('tick', tick);
  },
};

function start() {
  lb = {
    width: 2000,
    height: 2000,
  };
  ls = new createjs.Container();
  hero = new Hero({ ss, x: lb.width / 2, y: lb.height / 2 });
  const enemy = new Enemy({ ss, x: 300, y: 300 });

  stage.addChild(ls);
  hero.addTo(ls);
  enemy.addTo(ls);
  // ls.addChild(new Target({
  //   ss,
  //   x: 800,
  //   y: 800,
  //   vY: 1,
  //   vX: 1,
  // }).el);

  for (let i = 0; i < 20; i++) createMeteor();
}

function createMeteor() {
  const rand = Math.floor(Math.random() * 4);
  let vY = (Math.random() - 0.5) * 2;
  let vX = (Math.random() - 0.5) * 2;
  let x = Math.random() * lb.width;
  let y = Math.random() * lb.height;

  switch (rand) {
    case 0:
      y = -300;
      break;
    case 1:
      x = lb.width + 300;
      vX = -1;
      break;
    case 2:
      y = lb.height + 300;
      vY = -1;
      break;
    case 3:
      x = -300;
      break;
    default:
      break;
  }

  const meteor = new Meteor({ ss, x, y, vY, vX });
  meteor.addTo(ls);
}

function tick(e) {
  if (!(++ticks % 5)) createMeteor();

  collisions.process(lb);
  ai.setActions(lb);
  camera.move({ hero, lb, cb, ls, stage });
  stage.update();
  //e.remove();
}
