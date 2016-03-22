import Element from './element.js';
import actions from '../actions.js';

export default class Hero extends Element {
  constructor(ss) {
    super(ss);
    this.el = new createjs.Container();
    this.body = new createjs.Sprite(ss, 'playerShip1_orange');
    this.el.addChild(this.body);
  }
}
