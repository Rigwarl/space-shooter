import collisions from './collisions.js';

const meteors = new Set();
const enemies = new Set();
const map = new Map();
const enemiesMap = new Map();
const steps = 40;
const step = 20;
let lb;
let target;

const actions = [
  { up: true,   none: true,  multi: 1   },
  { up: true,   left: true,  multi: 1   },
  { up: true,   right: true, multi: 1   },
  { down: true, none: true,  multi: 0.7 },
  { down: true, left: true,  multi: 0.7 },
  { down: true, right: true, multi: 0.7 },
  { none: true, left: true,  multi: 0.8 },
  { none: true, right: true, multi: 0.8 },
  //{ none: true,              multi: 0.5 },
];

export default {
  add(item) {
    if (item.constructor.name === 'Meteor') meteors.add(item);
    if (item.constructor.name === 'Hero') enemies.add(item);
    if (item.constructor.name === 'Target') target = item;
  },
  remove(item) {
    if (item.constructor.name === 'Meteor') meteors.delete(item);
    if (item.constructor.name === 'Hero') enemies.delete(item);
    if (item.constructor.name === 'Target') target = null;
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
  const oldDist = collisions.getDistance(newEnemy, target);
  const multi = steps / to;
  let result = 0;

  for (let i = from + 1; i <= to; i++) {
    moveEnemy(newEnemy, action);
    const dist = collisions.getDistance(newEnemy, target);

    for (const meteor of map.get(i)) {
      if (collisions.checkPair(newEnemy, meteor)) {
        result -= 1;
      }
    }
    if (collisions.checkFrameHit(newEnemy, lb, true)) {
      result -= 0.3;
    }
    result += checkTarget(newEnemy, dist, oldDist);
  }

  return (result || action.multi) * multi;
}

function checkTarget(enemy, dist, oldDist) {
  if (dist > 320) {
    return 0;
  }

  const angleToTarget = Math.atan2(enemy.y - target.y, enemy.x - target.x) * 180 / Math.PI;
  const angle = Math.abs(angleToTarget - enemy.rotation - 90) % 360;

  if (angle < 5) return 0.9;
  if (angle < 10) return 0.6;

  if (dist < oldDist) {
    return 0.2;
  }
  return 0;
}

function checkFire(enemy) {
  if (collisions.getDistance(enemy, target) > 380) {
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
      map.get(i).delete(another);
      map.get(i).delete(meteor);
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
