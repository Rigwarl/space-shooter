import Element from './element.js';

export default class Target extends Element {
  constructor(args) {
    args.body = 'meteorBrown_big1';
    super(args);

    this.radius = 46;
    this.damage = 25;
    this.health = 3000;
    this.vX = Math.random() * 20 * args.vX;
    this.vY = Math.random() * 20 * args.vY;
    this.vRot = Math.random() * 5 - 2.5;

    this.addToCollisions();
    this.addToAi();
    this.el.addEventListener('tick', () => this.tick());
  }
  takeHit(enemy) {
    this.health -= enemy.damage;
    if (this.health <= 0) this.destroy();
    console.log(this.health);
  }
  tick() {
    this.move();
  }
}
