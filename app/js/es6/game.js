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

export function init(args) {
  ss = args.ss;
  cb = args.cb;
  stage = args.stage;

  start();
  createjs.Ticker.addEventListener('tick', tick);
}

function start() {
  lb = {
    width: 2000,
    height: 2000,
  };
  ls = new createjs.Container();
  hero = new Hero({ ss, x: lb.width / 2, y: lb.height / 2 });

  stage.addChild(ls);
  hero.addTo(ls);

  createMeteorites();
}

function createMeteorites() {
  for (let i = 0; i < 50; i++) {
    const meteor = new Meteor({
      ss,
      x: Math.random() * lb.width,
      y: Math.random() * lb.height,
    });
    meteor.addTo(ls);
  }
}

function tick() {
  collisions.check(lb);
  camera.move({ hero, lb, cb, ls, stage });
  stage.update();
}
