import Element from './element.js';

export default class Meteor extends Element {
  constructor(args) {
    args.body = 'meteorGrey_big1';
    super(args);

    this.radius = 46;
    this.damage = 25;
    this.health = 30;
    this.vX = Math.random() * 6 * args.vX;
    this.vY = Math.random() * 6 * args.vY;
    this.vRot = Math.random() * 5 - 2.5;

    this.addToCollisions();
    this.addToAi();
    this.el.addEventListener('tick', () => this.tick());
  }
  takeHit(enemy) {
    this.health -= enemy.damage;
    if (this.health <= 0) this.destroy();
  }
  tick() {
    this.x += this.vX;
    this.y += this.vY;
    this.rotation -= this.vRot;
    this.move();
  }
}
