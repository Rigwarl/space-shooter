import Element from './element.js';
import collisions from '../collisions.js';

export default class Meteor extends Element {
  constructor(args) {
    args.body = 'meteorBrown_big1';
    super(args);
    collisions.add(this);
  }
}
