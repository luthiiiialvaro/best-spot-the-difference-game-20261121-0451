// Cari Bedanya! — mouse and keyboard input.
// Clicks on either panel are converted to scene coordinates and handed to the
// game; arrow keys move a mirrored crosshair, Enter/Space marks at it,
// H spends a hint, P pauses, R restarts the scene, M mutes.

import { toViewCoords } from './render.js';

const STEP = 22;
const STEP_FAST = 60;

export function bindInput(api) {
  const { game } = api;
  const leftSvg = () => game.panels?.left.svg;
  const rightSvg = () => game.panels?.right.svg;

  function clickOn(svg, side) {
    if (!svg) return;
    svg.addEventListener('pointerdown', (ev) => {
      if (game.state !== 'playing') return;
      ev.preventDefault();
      const point = toViewCoords(svg, ev.clientX, ev.clientY);
      api.markAt(point, side);
    });
  }

  // Panels are rebuilt per scene, so (re)bind whenever the scene renders.
  // A WeakSet keeps each svg bound exactly once (the observer fires for both
  // holders on every rebuild, which would otherwise double-bind a click).
  const bound = new WeakSet();
  function bindOnce(svg, side) {
    if (!svg || bound.has(svg)) return;
    bound.add(svg);
    clickOn(svg, side);
  }

  const observer = new MutationObserver(() => {
    bindOnce(leftSvg(), 'left');
    bindOnce(rightSvg(), 'right');
  });
  observer.observe(document.getElementById('holder-left'), { childList: true });
  observer.observe(document.getElementById('holder-right'), { childList: true });

  document.addEventListener('keydown', (ev) => {
    if (ev.repeat && !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(ev.key)) return;
    const fast = ev.shiftKey ? STEP_FAST : STEP;
    switch (ev.key) {
      case 'ArrowLeft': ev.preventDefault(); api.moveCrosshair(-fast, 0); break;
      case 'ArrowRight': ev.preventDefault(); api.moveCrosshair(fast, 0); break;
      case 'ArrowUp': ev.preventDefault(); api.moveCrosshair(0, -fast); break;
      case 'ArrowDown': ev.preventDefault(); api.moveCrosshair(0, fast); break;
      case 'Enter':
      case ' ': ev.preventDefault(); api.markAtCrosshair(); break;
      case 'h': case 'H': api.useHint(); break;
      case 'p': case 'P': api.togglePause(); break;
      case 'r': case 'R':
        if (['playing', 'paused', 'game-over'].includes(game.state)) {
          api.retryScene();
        }
        break;
      case 'm': case 'M': api.toggleMute(); break;
      default: break;
    }
  });
}
