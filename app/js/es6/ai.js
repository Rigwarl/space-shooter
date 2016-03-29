import collisions from './collisions.js';

const meteors = new Set();
const enemies = new Set();
const steps = 60;
const map = new Map();
const enemiesMap = new Map();
let lb;

const verticalActions = ['up', 'down', 'none'];
const horisontalActions = ['none', 'left', 'right'];

export default {
  add(item) {
    if (item.constructor.name === 'Meteor') meteors.add(item);
    if (item.constructor.name === 'Hero') enemies.add(item);
  },
  remove(item) {
    if (item.constructor.name === 'Meteor') meteors.delete(item);
    if (item.constructor.name === 'Hero') enemies.add(item);
  },
  setActions(levelBounds) {
    lb = levelBounds;
    initMaps();
    calcMeteors();
    for (const enemy of enemies) setEnemy(enemy, lb);
  },
};

function setEnemy(enemy) {
  for (const vertical of verticalActions) {
    for (const horisontal of horisontalActions) {
      const actions = {
        [vertical]: true,
        [horisontal]: true,
      };
      if (checkAction(enemy, actions)) {
        enemy.setActions(actions);
        return;
      }
    }
  }
  console.log('fail');
}

function checkAction(enemy, actions) {
  const newEnemy = copy(enemy);
  for (let i = 1; i < steps; i++) {
    // const newEnemy = copy(enemiesMap.get(i - 1).get(enemy));
    moveEnemy(newEnemy, actions);
    for (const meteor of map.get(i)) {
      if (collisions.checkPair(newEnemy, meteor)) {
        return false;
      }
    }
    if (collisions.checkFrameHit(newEnemy, lb)) return false;
    // enemiesMap.get(i).set(enemy, newEnemy);
  }
  // if (collisions.checkFrameHit(newEnemy, lb, false)) return false;
  return true;
}

const CONFIG = {
  speed: 1,
  rotSpeed: 0.7,
  inertia: 0.94,
  rotInertia: 0.85,
};

function moveEnemy(enemy, actions) {
  let thrust = 0;
  let heading = 0;

  if (actions.up) thrust = -1;
  if (actions.down) thrust = 0.5;
  if (actions.left) heading = -1;
  if (actions.right) heading = 1;

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

  for (let i = 0; i < steps; i++) {
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
  for (let i = 1; i < steps; i++) {
    for (const meteor of map.get(i - 1)) {
      const newMeteor = copy(meteor);

      moveMeteor(newMeteor);
      map.get(i).add(newMeteor);
      calcMeteor(i, newMeteor);
      collisions.checkFrameHit(meteor, lb, true);
    }
  }
}

function calcMeteor(step, meteor) {
  for (const another of map.get(step)) {
    if (collisions.checkPair(meteor, another)) {
      map.get(step).delete(another);
      map.get(step).delete(meteor);
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
