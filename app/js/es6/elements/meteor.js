import Element from './element.js';
import collisions from '../collisions.js';

export default class Meteor extends Element {
  constructor(args) {
    args.body = 'meteorBrown_big1';
    super(args);

    this.shape = 'circle';
    this.radius = 46;
    this.damage = 25;
    this.vX = Math.random() * 5 * args.vX;
    this.vY = Math.random() * 5 * args.vY;
    this.vRot = Math.random() * 5 - 2.5;

    collisions.add(this);
    this.el.addEventListener('tick', () => this.tick());
  }
  tick() {
    this.el.x += this.vX;
    this.el.y += this.vY;
    this.el.rotation -= this.vRot;
  }
  destroy() {
    this.remove();
    collisions.remove(this);
  }
}
