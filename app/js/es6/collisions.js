const items = new Set();
const actions = new Set();
const collideTable = {
  Meteor: { Hero: 'destroy', Meteor: 'destroy' },
  Hero: { Hero: null, Meteor: null },
};

export default {
  add(item) {
    items.add(item);
  },
  remove(item) {
    items.delete(item);
  },
  process(lb) {
    items.forEach(obj1 => {
      checkFrameHit(obj1, lb);
      items.forEach(obj2 => {
        checkPair(obj1, obj2);
      });
    });

    actions.forEach(item => item[0][item[1]](item[2]));
    actions.clear();
  },
};

function checkPair(obj1, obj2) {
  if (obj1 !== obj2) {
    if (obj1.shape === 'circle' && obj2.shape === 'circle') {
      if (obj1.radius + obj2.radius > getDistance(obj1, obj2)) {
        const action1 = collideTable[obj1.constructor.name][obj2.constructor.name];
        const action2 = collideTable[obj2.constructor.name][obj1.constructor.name];

        if (action1) actions.add([obj1, action1, obj2]);
        if (action2) actions.add([obj2, action2, obj1]);
      }
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

function getDistance(obj1, obj2) {
  return Math.sqrt(Math.pow(obj1.el.x - obj2.el.x, 2) + Math.pow(obj1.el.y - obj2.el.y, 2));
}
