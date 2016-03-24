import Element from './element.js';
import collisions from '../collisions.js';

export default class Meteor extends Element {
  constructor(args) {
    args.body = 'meteorBrown_big1';
    super(args);

    this.shape = 'circle';
    this.radius = 46;
    collisions.add(this);
  }
  destroy() {
    this.remove();
    collisions.remove(this);
  }
}
