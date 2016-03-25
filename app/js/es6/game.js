import collisions from './collisions.js';
import camera from './camera.js';
import Hero from './elements/hero.js';
import Meteor from './elements/meteor.js';

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

  stage.addChild(ls);
  hero.addTo(ls);

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
      y = -100;
      break;
    case 1:
      x = lb.width + 100;
      vX = -1;
      break;
    case 2:
      y = lb.height + 100;
      vY = -1;
      break;
    case 3:
      x = -100;
      break;
    default:
      break;
  }

  const meteor = new Meteor({ ss, x, y, vY, vX });
  meteor.addTo(ls);
}

function tick() {
  if (!(++ticks % 5)) createMeteor();

  collisions.process(lb);
  camera.move({ hero, lb, cb, ls, stage });
  stage.update();
}
