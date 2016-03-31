import Ship from './ship.js';
import actions from '../actions.js';

const CONFIG = {
  speed: 1,
  rotSpeed: 0.7,
  inertia: 0.94,
  rotInertia: 0.85,
};

export default class Hero extends Ship {
  constructor(args) {
    args.body = 'playerShip1_orange';
    args.health = 150;
    super(args);

    this.weaponTimer = 10;

    this.createFire();

    this.damageSkin = new createjs.Sprite(args.ss, 'playerShip1_damage1').set({ visible: false });
    this.el.addChild(this.damageSkin);
  }
  takeHit(enemy) {
    console.log('hero take ' + enemy.damage);
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
      this.damageSkin.visible = false;
    } else {
      this.damageSkin.visible = true;
      createjs.Tween.get(this.damageSkin, { override: true })
        .to({
          alpha: 0.7,
        }, 200, createjs.Ease.backInOut)
        .to({
          alpha: 1,
        }, 200, createjs.Ease.backInOut);
      this.damageSkin.gotoAndStop(`playerShip1_damage${amount}`);
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
  tick() {
    this.setActions(actions.get());
    this.calcMove(CONFIG);
    this.move();

    this.fireWeapon();
    this.animateFire();
  }
}
