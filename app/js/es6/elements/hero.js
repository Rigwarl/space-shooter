import Element from './element.js';
import actions from '../actions.js';

const CONFIG = {
  speed: 2,
  rotSpeed: 2,
  inertia: 0.94,
  rotInertia: 0.85,
};

export default class Hero extends Element {
  constructor(args) {
    args.body = 'playerShip1_orange';
    super(args);
    this.createProps();
    this.el.addEventListener('tick', () => this.tick());
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
    this.thrust = 0;
    this.heading = 0;

    if (actions.up) this.thrust = -1;
    if (actions.down) this.thrust = 0.5;
    if (actions.left) this.heading = -1;
    if (actions.right) this.heading = 1;
  }
}
