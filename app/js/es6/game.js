import Hero from './elements/hero.js';

export default {
  init({ stage, ss, cb }) {
    this.ss = ss;
    this.cb = cb;

    this.ls = new createjs.Container();
    stage.addChild(this.ls);

    this.start();
  },
  start() {
    this.ls.addChild(new Hero(this.ss).el);
  },
};
