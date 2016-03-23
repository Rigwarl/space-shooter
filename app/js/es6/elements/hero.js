import Element from './element.js';
import actions from '../actions.js';
import collisions from '../collisions.js';

const CONFIG = {
  speed: 1.2,
  rotSpeed: 1,
  inertia: 0.94,
  rotInertia: 0.85,
};

export default class Hero extends Element {
  constructor(args) {
    args.body = 'playerShip1_orange';
    super(args);
    this.createFire();
    this.createProps();
    this.el.addEventListener('tick', () => this.tick());
    collisions.add(this);
  }
  createFire() {
    this.ss.getAnimation('fire13').next = 'fire12';
    this.ss.getAnimation('fire12').next = 'fire13';
    this.ss.getAnimation('fire17').next = 'fire13';

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
  createProps() {
    this.rotation = 0;
    this.heading = 0;
    this.thrust = 0;
    this.vRot = 0;
    this.vX = 0;
    this.vY = 0;
  }
  tick() {
    this.handleActions();
    this.move();
    this.animateFire();
  }
  animateFire() {
    let leftTo = 0;
    let rightTo = 0;

    if (this.thrust === -1) {
      leftTo = 1;
      rightTo = 1;

      if (this.heading === -1) leftTo = 0.75;
      else if (this.heading === 1) rightTo = 0.75;
    } else {
      if (this.heading === -1) rightTo = 0.65;
      else if (this.heading === 1) leftTo = 0.65;
    }

    createjs.Tween.get(this.fireRight, { override: true }).to({ scaleY: rightTo }, 300);
    createjs.Tween.get(this.fireLeft, { override: true }).to({ scaleY: leftTo }, 300);
  }
  move() {
    this.rotation += this.vRot * CONFIG.rotSpeed;
    this.el.rotation = this.rotation;
    this.el.x += this.vX;
    this.el.y += this.vY;

    this.vRot += this.heading;
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
  handleActions() {
    this.oldThrust = this.thrust;
    this.thrust = 0;
    this.heading = 0;

    if (actions.up) this.thrust = -1;
    if (actions.down) this.thrust = 0.5;
    if (actions.left) this.heading = -1;
    if (actions.right) this.heading = 1;
  }
}
