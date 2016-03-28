import collisions from '../collisions.js';

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

    this.el.addChild(this.body);
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
  }
}
