import Element from './element.js';
import Laser from './laser.js';

const CONFIG = {
  speed: 1,
  rotSpeed: 0.7,
  inertia: 0.94,
  rotInertia: 0.85,
};

export default class Ship extends Element {
  constructor(args) {
    super(args);
    this.maxHealth = args.health || 75;

    this.createProps();
    this.addToCollisions();
    this.addToAi();

    this.el.addEventListener('tick', () => this.tick());
  }
  createProps() {
    this.health = this.maxHealth;
    this.radius = 44;
    this.damage = 35;

    this.heading = 0;
    this.thrust = 0;
    this.weaponCd = 0;
    this.firing = false;

    this.rotation = 0;
    this.vRot = 0;
    this.vX = 0;
    this.vY = 0;
  }
  takeHit(enemy) {
    this.health -= enemy.damage;
    if (this.health <= 0) this.destroy();
  }
  fireWeapon() {
    if (!this.firing || this.weaponCd > 0) return;
    const laser = new Laser({
      ss: this.ss,
      x: this.x - 1.6 * this.radius * Math.sin(this.rotation * Math.PI / -180),
      y: this.y - 1.6 * this.radius * Math.cos(this.rotation * Math.PI / -180),
      rotation: this.rotation,
      vX: this.vX,
      vY: this.vY,
    });

    this.weaponCd = 8;
    this.el.parent.addChild(laser.el);
  }
  calcMove() {
    this.vRot += this.heading * CONFIG.rotSpeed;
    this.vRot *= CONFIG.rotInertia;

    const ratioX = Math.sin(this.rotation * Math.PI / -180) * this.thrust;
    const ratioY = Math.cos(this.rotation * Math.PI / -180) * this.thrust;
    const diffX = ratioX * CONFIG.speed;
    const diffY = ratioY * CONFIG.speed;

    this.vX += diffX;
    this.vY += diffY;

    this.vX = this.vX * CONFIG.inertia;
    this.vY = this.vY * CONFIG.inertia;
  }
  setActions(act) {
    this.thrust = 0;
    this.heading = 0;
    this.firing = false;

    if (act.up) this.thrust = -1;
    if (act.down) this.thrust = 0.5;
    if (act.left) this.heading = -1;
    if (act.right) this.heading = 1;
    if (act.fire) this.firing = true;
  }
  tick() {
    this.weaponCd--;

    this.calcMove();
    this.move();

    this.fireWeapon();
  }
}
