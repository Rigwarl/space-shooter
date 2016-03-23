export default {
  items: new Set(),
  add(item) {
    this.items.add(item);
  },
  remove(item) {
    this.items.remove(item);
  },
  check(lb) {
    this.items.forEach(obj1 => {
      this.checkFrameHit(obj1, lb);
      this.items.forEach(obj2 => {
        this.checkEl(obj1, obj2);
      });
    });
  },
  checkEl(obj1, obj2) {
  },
  checkFrameHit(obj, lb) {
    if ((obj.el.x < 0 && obj.vX < 0) || (obj.el.x > lb.width && obj.vX > 0)) {
      obj.vX = -obj.vX * 0.7;
    }
    if ((obj.el.y < 0 && obj.vY < 0) || (obj.el.y > lb.height && obj.vY > 0)) {
      obj.vY = -obj.vY * 0.7;
    }
  },
};
