import Element from './element.js';

const speed = 15;

export default class Laser extends Element {
  constructor(args) {
    args.body = 'laserGreen02';
    super(args);

    this.el.regY = args.regY;
    this.el.rotation = args.rotation;

    this.vX = - Math.sin((this.el.rotation) * Math.PI / -180) * speed;
    this.vY = - Math.cos((this.el.rotation) * Math.PI / -180) * speed;
    this.radius = 1;

    this.addToCollisions();
    this.el.addEventListener('tick', () => this.tick());
  }
  tick() {
    this.el.x += this.vX;
    this.el.y += this.vY;
  }
}
