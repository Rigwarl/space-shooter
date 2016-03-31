import collisions from '../collisions.js';
import ai from '../ai.js';

export default class Element {
  constructor({ ss, body, x = 0, y = 0 }) {
    this.ss = ss;
    this.el = new createjs.Container();
    this.body = new createjs.Sprite(this.ss, body);

    this.bounds = this.body.getBounds();
    this.el.set({
      regX: this.bounds.width / 2,
      regY: this.bounds.height / 2,
      x,
      y,
    });
    this.x = x;
    this.y = y;

    this.el.addChild(this.body);
  }
  move() {
    this.x += this.vX || 0;
    this.y += this.vY || 0;
    this.rotation += this.vRot || 0;

    this.el.x = this.x;
    this.el.y = this.y;
    this.el.rotation = this.rotation;
  }
  addToAi() {
    ai.add(this);
  }
  addToCollisions() {
    collisions.add(this);
  }
  addTo(parent) {
    parent.addChild(this.el);
  }
  remove() {
    if (this.el.parent) this.el.parent.removeChild(this.el);
  }
  destroy() {
    this.remove();
    collisions.remove(this);
    ai.remove(this);
  }
}
