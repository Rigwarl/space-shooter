const actions = {};

export default actions;

const keyMap = {
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right',
  32: 'fire',
};

window.addEventListener('keydown', e => {
  actions[keyMap[e.keyCode]] = true;
});
window.addEventListener('keyup', e => {
  actions[keyMap[e.keyCode]] = false;
});
