const items = new Set();

export default {
  add(item) {
    items.add(item);
  },
  remove(item) {
    items.remove(item);
  },
  check(lb) {
    items.forEach(obj1 => {
      checkFrameHit(obj1, lb);
      items.forEach(obj2 => {
        checkItems(obj1, obj2);
      });
    });
  },
};

function checkItems(obj1, obj2) {
  if (obj1 !== obj2) {
    if (obj1.type === 'circle' && obj2.type === 'circle') {
      //if (check)
    }
  }
}

function checkFrameHit(obj, lb) {
  if ((obj.el.x < 0 && obj.vX < 0) || (obj.el.x > lb.width && obj.vX > 0)) {
    obj.vX = -obj.vX * 0.85;
  }
  if ((obj.el.y < 0 && obj.vY < 0) || (obj.el.y > lb.height && obj.vY > 0)) {
    obj.vY = -obj.vY * 0.85;
  }
}
