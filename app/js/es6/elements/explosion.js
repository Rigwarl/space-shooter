import Element from './element.js';

export default class Explosion extends Element {
  constructor(args) {
    args.body = 'laserGreen15';
    super(args);

    this.vX = args.vX;
    this.vY = args.vY;

    this.el.set({
      scaleX: 0.5,
      scaleY: 0.5,
    });

    createjs.Tween.get(this.el, { useTicks: true })
      .to({
        scaleX: 1,
        scaleY: 1,
      }, 3)
      .wait(3)
      .to({
        scaleX: 0.5,
        scaleY: 0.5,
      }, 3);

    this.lifetime = 0;
    this.el.addEventListener('tick', () => this.tick());
  }
  tick() {
    this.move();
    switch (++this.lifetime) {
      case 3:
        this.body.gotoAndStop('laserGreen14');
        break;
      case 6:
        this.body.gotoAndStop('laserGreen15');
        break;
      case 9:
        this.destroy();
        break;
      default:
    }
  }
}
