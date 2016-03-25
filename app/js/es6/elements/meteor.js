import Element from './element.js';

export default class Meteor extends Element {
  constructor(args) {
    args.body = 'meteorBrown_big1';
    super(args);

    this.radius = 46;
    this.damage = 25;
    this.vX = Math.random() * 6 * args.vX;
    this.vY = Math.random() * 6 * args.vY;
    this.vRot = Math.random() * 5 - 2.5;

    this.addToCollisions();
    this.el.addEventListener('tick', () => this.tick());
  }
  tick() {
    this.el.x += this.vX;
    this.el.y += this.vY;
    this.el.rotation -= this.vRot;
  }
}
