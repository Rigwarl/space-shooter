export default {
  move({ hero, lb, cb, ls, stage }) {
    if (hero.el.x < lb.width - cb.xCenter && hero.el.x > cb.xCenter) {
      ls.x = -hero.el.x + cb.xCenter;
    }
    if (hero.el.y < lb.height - cb.yCenter && hero.el.y > cb.yCenter) {
      ls.y = -hero.el.y + cb.yCenter;
    }
    moveBg(stage.canvas, ls);
  },
};

function moveBg(canvas, ls) {
  canvas.style.backgroundPosition = `${ls.x}px ${ls.y}px`;
}
