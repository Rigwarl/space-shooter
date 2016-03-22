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
}
