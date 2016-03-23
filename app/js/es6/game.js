import collisions from './collisions.js';
import camera from './camera.js';
import Hero from './elements/hero.js';
import Element from './elements/element.js';

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
  ls.addChild(
    hero.el,
    new Element({ ss, body: 'meteorBrown_big1' }).el,
    new Element({ ss, body: 'meteorBrown_big1', x: lb.width, y: lb.height }).el,
    new Element({ ss, body: 'meteorBrown_big1', x: lb.width }).el,
    new Element({ ss, body: 'meteorBrown_big1', y: lb.height }).el
  );
}

function tick() {
  collisions.check(lb);
  camera.move({ hero, lb, cb, ls });
  stage.update();
}
