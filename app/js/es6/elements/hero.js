import Element from './element.js';
import Laser from './laser.js';
import actions from '../actions.js';

const CONFIG = {
  speed: 1,
  rotSpeed: 0.7,
  inertia: 0.94,
  rotInertia: 0.85,
};

export default class Hero extends Element {
  constructor(args) {
    args.body = 'playerShip1_orange';
    super(args);

    this.damage = new createjs.Sprite(args.ss, 'playerShip1_damage1').set({ visible: false });
    this.el.addChild(this.damage);

    this.createFire();
    this.createProps();
    this.addToCollisions();
    this.addToAi();

    this.el.addEventListener('tick', () => this.tick());
  }
  createProps() {
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.radius = 44;

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
    this.changeHealth(-enemy.damage);
  }
  changeHealth(amount) {
    this.health += amount;
    const hp = this.health / this.maxHealth;

    if (hp <= 0) this.destroy();
    else if (hp <= 0.25) this.showDamage(3);
    else if (hp <= 0.50) this.showDamage(2);
    else if (hp <= 0.75) this.showDamage(1);
    else {
      this.showDamage(0);
      if (hp > 1) this.health = this.maxHealth;
    }
  }
  showDamage(amount) {
    if (amount === 0) {
      this.damage.visible = false;
    } else {
      this.damage.visible = true;
      createjs.Tween.get(this.damage, { override: true })
        .to({
          alpha: 0.7,
        }, 200, createjs.Ease.backInOut)
        .to({
          alpha: 1,
        }, 200, createjs.Ease.backInOut);
      this.damage.gotoAndStop(`playerShip1_damage${amount}`);
    }
  }
  createFire() {
    this.ss.getAnimation('fire13').next = 'fire12';
    this.ss.getAnimation('fire12').next = 'fire13';

    this.fireLeft = new createjs.Sprite(this.ss, 'fire13').set({
      x: 17,
      y: 60,
      scaleY: 0,
    });
    this.fireRight = new createjs.Sprite(this.ss, 'fire13').set({
      x: 68,
      y: 60,
      scaleY: 0,
    });
    this.el.addChildAt(this.fireLeft, this.fireRight, 0);
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
  animateFire() {
    let leftTo = 0;
    let rightTo = 0;

    if (this.thrust === -1) {
      leftTo = 1;
      rightTo = 1;

      if (this.heading === -1) leftTo = 0.75;
      else if (this.heading === 1) rightTo = 0.75;
    } else if (this.thrust === 0) {
      if (this.heading === -1) rightTo = 0.65;
      else if (this.heading === 1) leftTo = 0.65;
    }

    createjs.Tween.get(this.fireRight, { override: true }).to({ scaleY: rightTo }, 300);
    createjs.Tween.get(this.fireLeft, { override: true }).to({ scaleY: leftTo }, 300);
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
    this.oldThrust = this.thrust;
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

    this.setActions(actions.get());
    this.calcMove();
    this.move();

    this.animateFire();
    this.fireWeapon();
  }
}
