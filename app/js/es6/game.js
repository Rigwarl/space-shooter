import Hero from './elements/hero.js';

let ss;
let cb;
let stage;
let ls;
let hero;

export function init(args) {
  ss = args.ss;
  cb = args.cb;
  stage = args.stage;
  ls = new createjs.Container();

  stage.addChild(ls);
  start();
}

function start() {
  hero = new Hero({ ss, x: 400, y: 300 });
  ls.addChild(hero.el);
}
