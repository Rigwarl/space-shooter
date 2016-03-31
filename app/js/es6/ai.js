import collisions from './collisions.js';

const meteors = new Set();
const enemies = new Set();
const map = new Map();
const enemiesMap = new Map();
const steps = 30;
const step = 15;
let lb;
let target;
const targetMap = new Map();

const actions = [
  { up: true,   none: true,  multi: 1   },
  { up: true,   left: true,  multi: 1   },
  { up: true,   right: true, multi: 1   },
  { down: true, none: true,  multi: 0.7 },
  { down: true, left: true,  multi: 0.7 },
  { down: true, right: true, multi: 0.7 },
  { none: true, left: true,  multi: 0.8 },
  { none: true, right: true, multi: 0.8 },
  { none: true,              multi: 0.7 },
];

export default {
  add(item) {
    if (item.constructor.name === 'Meteor') meteors.add(item);
    if (item.constructor.name === 'Hero') target = item;
    if (item.constructor.name === 'Enemy') enemies.add(item);
  },
  remove(item) {
    if (item.constructor.name === 'Meteor') meteors.delete(item);
    //if (item.constructor.name === 'Hero') target = null;
    if (item.constructor.name === 'Enemy') enemies.delete(item);
  },
  setActions(levelBounds) {
    lb = levelBounds;
    initMaps();
    calcMeteors();
    for (const enemy of enemies) setEnemy(enemy, lb);
  },
};

function setEnemy(enemy) {
  const actionMap = calcActions(enemy, 0, step);
  let max = -100;
  let action = {};

  for (const key of actionMap.keys()) {
    if (actionMap.get(key) > max) {
      action = key;
      max = actionMap.get(key);
    }
  }

  if (checkFire(enemy)) {
    enemy.setActions(Object.assign({ fire: true }, action));
  } else {
    enemy.setActions(action);
  }
}

function calcActions(enemy, from, to) {
  const result = new Map();

  for (const action of actions) {
    const current = checkAction(enemy, action, from, to);
    let after = 0;

    if (to + step <= steps) {
      after = calcActions(enemy, from + step, to + step);
      after = Math.max(...after.values());
    }

    result.set(action, current + after);
  }

  return result;
}

function checkAction(enemy, action, from, to) {
  const newEnemy = copy(enemy);
  const multi = steps / to;
  let result = 0;
  const veryOldDist = collisions.getDistance(newEnemy, targetMap.get(from + 1));

  for (let i = from + 1; i <= to; i++) {
    const targ = targetMap.get(i);
    const oldDist = collisions.getDistance(newEnemy, targ);
    moveEnemy(newEnemy, action);
    const dist = collisions.getDistance(newEnemy, targ);

    for (const meteor of map.get(i)) {
      if (collisions.checkPair(newEnemy, meteor)) {
        result -= 1.5;
      }
    }
    if (collisions.checkFrameHit(newEnemy, lb, true)) {
      result -= 0.6;
    }
    result += checkTarget(newEnemy, targ, dist, oldDist, action);
  }

  if (!result) {
    if (action.up && (collisions.getDistance(newEnemy, targetMap.get(to)) < veryOldDist)) {
      result += 1;
    }
    result += action.multi;
  }

  return result * multi;
}

function checkTarget(enemy, targ, dist, oldDist, action) {
  if (dist > 320) {
    return 0;
  }

  const angleToTarget = Math.atan2(enemy.y - targ.y, enemy.x - targ.x) * 180 / Math.PI;
  const angle = Math.abs(angleToTarget - enemy.rotation - 90) % 360;

  if (angle < 5) return 0.9;
  if (angle < 10) return 0.5;
  if (angle < 15) return 0.1;

  if (action.up && (dist < oldDist)) {
    return 0.03;
  }
  return 0;
}

function checkFire(enemy) {
  if (collisions.getDistance(enemy, target) > 450) {
    return false;
  }

  const angleToTarget = Math.atan2(enemy.y - target.y, enemy.x - target.x) * 180 / Math.PI;
  const angle = Math.abs(angleToTarget - enemy.rotation - 90) % 360;

  return angle < 25;
}

const CONFIG = {
  speed: 1,
  rotSpeed: 0.7,
  inertia: 0.94,
  rotInertia: 0.85,
};

function moveEnemy(enemy, action) {
  let thrust = 0;
  let heading = 0;

  if (action.up) thrust = -1;
  if (action.down) thrust = 0.5;
  if (action.left) heading = -1;
  if (action.right) heading = 1;

  enemy.vRot += heading * CONFIG.rotSpeed;
  enemy.vRot *= CONFIG.rotInertia;

  const ratioX = Math.sin(enemy.rotation * Math.PI / -180) * thrust;
  const ratioY = Math.cos(enemy.rotation * Math.PI / -180) * thrust;
  const diffX = ratioX * CONFIG.speed;
  const diffY = ratioY * CONFIG.speed;

  enemy.vX += diffX;
  enemy.vY += diffY;

  enemy.vX = enemy.vX * CONFIG.inertia;
  enemy.vY = enemy.vY * CONFIG.inertia;

  enemy.x += enemy.vX;
  enemy.y += enemy.vY;
  enemy.rotation += enemy.vRot;
}

function initMaps() {
  map.clear();
  enemiesMap.clear();
  targetMap.clear();

  const newTarg = copy(target);
  moveMeteor(newTarg);
  collisions.checkFrameHit(newTarg, lb, true);
  moveMeteor(newTarg);
  collisions.checkFrameHit(newTarg, lb, true);
  moveMeteor(newTarg);
  collisions.checkFrameHit(newTarg, lb, true);
  moveMeteor(newTarg);
  collisions.checkFrameHit(newTarg, lb, true);

  targetMap.set(0, newTarg);

  for (let i = 1; i <= steps; i++) {
    const newTarget = copy(targetMap.get(i - 1));
    moveMeteor(newTarget);
    collisions.checkFrameHit(newTarget, lb, true);
    targetMap.set(i, newTarget);
  }

  for (let i = 0; i <= steps; i++) {
    map.set(i, new Set());
    enemiesMap.set(i, new Map());
  }

  for (const meteor of meteors) {
    map.get(0).add(copy(meteor));
  }

  for (const enemy of enemies) {
    enemiesMap.get(0).set(enemy, copy(enemy));
  }
}

function calcMeteors() {
  for (let i = 1; i <= steps; i++) {
    for (const meteor of map.get(i - 1)) {
      if (meteor.destroyed) continue;
      const newMeteor = copy(meteor);

      moveMeteor(newMeteor);
      map.get(i).add(newMeteor);
      calcMeteor(i, newMeteor);
      collisions.checkFrameHit(meteor, lb, true);
    }
  }
}

function calcMeteor(i, meteor) {
  for (const another of map.get(i)) {
    if (collisions.checkPair(meteor, another)) {
      meteor.destroyed = true;
      another.destroyed = true;
    }
  }
}

function moveMeteor(meteor) {
  meteor.x += meteor.vX;
  meteor.y += meteor.vY;
}

function copy({ x, y, rotation, vX, vY, vRot, radius }) {
  return { x, y, rotation, vX, vY, vRot, radius };
}
