import Element from './element.js';
import Explosion from './explosion.js';

const speed = 25;

export default class Laser extends Element {
  constructor(args) {
    args.body = 'laserGreen12';
    super(args);

    this.el.regY = 0;
    this.el.rotation = args.rotation;

    this.rotation = args.rotation;
    this.damage = 10;
    this.lifetime = 0;

    this.vX = args.vX - Math.sin((this.rotation) * Math.PI / -180) * speed;
    this.vY = args.vY - Math.cos((this.rotation) * Math.PI / -180) * speed;
    this.radius = 3;

    this.addToCollisions();
    this.el.addEventListener('tick', () => this.tick());
  }
  processLife() {
    switch (++this.lifetime) {
      case 6:
        this.body.gotoAndStop('laserGreen10');
        break;
      case 12:
        this.body.gotoAndStop('laserGreen11');
        break;
      case 18:
        this.destroy();
        break;
      default:
    }
  }
  explode(enemy) {
    const explosion = new Explosion({
      ss: this.ss,
      x: this.el.x,
      y: this.el.y,
      vX: enemy.vX,
      vY: enemy.vY,
    });

    this.el.parent.addChild(explosion.el);
    this.destroy();
  }
  tick() {
    this.processLife();
    this.move();
  }
}
