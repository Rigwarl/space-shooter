import Ship from './ship.js';

export default class Enemy extends Ship {
  constructor(args) {
    args.body = 'enemyBlack1';
    super(args);

    this.el.rotation = 180;
    this.rotation = 135;
    this.weaponTimer = 15;
  }
  takeHit(enemy) {
    console.log('enemy take ' + enemy.damage);
    super.takeHit(enemy);
  }
  move() {
    super.move();
    this.el.rotation += 180;
  }
}
