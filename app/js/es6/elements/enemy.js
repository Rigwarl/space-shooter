import Ship from './ship.js';

export default class Enemy extends Ship {
  constructor(args) {
    args.body = 'enemyBlack1';
    super(args);

    this.el.rotation = 180;
    this.weaponTimer = 15;
  }
  destroy() {
    super.destroy();
    console.log('destroyed');
  }
  move() {
    super.move();
    this.el.rotation += 180;
  }
}
