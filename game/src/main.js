// Cari Bedanya! — bootstrap.
// Reads the demo query (?scene=0..2&found=0..7&demo=1) used for screenshots:
// it jumps straight into a scene with some differences pre-marked and the
// countdown paused, so a shot shows the game mid-play. Without a query the
// title screen is shown and the game starts from the first scene.

import { createGame } from './game.js';
import { bindInput } from './input.js';
import { SCENES } from './scenes.js';

const api = createGame();
bindInput(api);

const params = new URLSearchParams(window.location.search);
const demo = params.get('demo') === '1';
const sceneParam = Number.parseInt(params.get('scene') ?? '', 10);
const foundParam = Number.parseInt(params.get('found') ?? '', 10);

if (demo && Number.isInteger(sceneParam) && sceneParam >= 0 && sceneParam < SCENES.length) {
  const preFound = Number.isInteger(foundParam) ? Math.max(0, foundParam) : 0;
  api.game.demo = true;
  api.startScene(sceneParam, preFound);
} else {
  api.showTitle();
}
