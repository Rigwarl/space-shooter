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
    this.hero = new Hero(this.ss);
    this.hero.el.set({
      x: 300,
      y: 300,
    });
    this.ls.addChild(this.hero.el);
  },
};
