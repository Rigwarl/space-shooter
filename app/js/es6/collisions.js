const items = new Set();
const actions = new Set();
const collideTable = {
  Meteor: { Hero: 'destroy', Meteor: 'destroy', Laser: 'takeHit' },
  Hero:   { Hero: null,      Meteor: 'takeHit', Laser: 'takeHit' },
  Laser:  { Hero: 'destroy', Meteor: 'explode', Laser: null      },
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
      if (obj1.constructor.name !== 'Laser') {
        this.checkFrameHit(obj1, lb, true);
      }

      items.forEach(obj2 => {
        if (this.checkPair(obj1, obj2)) {
          setAction(obj1, obj2);
        }
      });
    });

    actions.forEach(item => item.obj1[item.action](item.obj2));
    actions.clear();
  },
  checkPair(obj1, obj2) {
    if (obj1 !== obj2) {
      if (obj1.radius + obj2.radius > getDistance(obj1, obj2)) {
        return true;
      }
    }
    return false;
  },
  checkFrameHit(obj, lb, turn) {
    let result = false;

    if ((obj.x - obj.radius < 0 && obj.vX < 0) ||
        (obj.x + obj.radius > lb.width && obj.vX > 0)) {
      if (turn) {
        obj.x -= obj.vX;
        obj.vX = -obj.vX * 0.9;
      }
      result = true;
    }
    if ((obj.y - obj.radius < 0 && obj.vY < 0) ||
        (obj.y + obj.radius > lb.height && obj.vY > 0)) {
      if (turn) {
        obj.y -= obj.vY;
        obj.vY = -obj.vY * 0.9;
      }
      result = true;
    }

    return result;
  },
};

function setAction(obj1, obj2) {
  const action = collideTable[obj1.constructor.name][obj2.constructor.name];
  if (action) actions.add({ obj1, action, obj2 });
}

function getDistance(obj1, obj2) {
  return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}
