import Element from './element.js';
import actions from '../actions.js';

export default class Hero extends Element {
  constructor(ss) {
    super(ss);
    this.el = new createjs.Container();
    this.body = new createjs.Sprite(ss, 'playerShip1_orange');
    this.el.addChild(this.body);

    this.el.addEventListener('tick', () => this.tick());
  }
  tick() {
    if (actions.up) this.el.y -= 1;
    if (actions.down) this.el.y += 1;
    if (actions.left) this.el.x -= 1;
    if (actions.right) this.el.x += 1;
  }
}
