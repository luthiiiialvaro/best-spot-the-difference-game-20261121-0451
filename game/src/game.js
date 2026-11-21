// Cari Bedanya! — game state: scenes, timer, score, hints, overlays.
// Owns the HUD and the overlay screens; render.js owns the pictures,
// input.js owns clicks and keys, audio.js owns the sounds.

import { SCENES } from './scenes.js';
import {
  makePanel, applyDiffsToRight, drawFoundMark, drawMiss, drawHintRing,
  clearMarks, drawCrosshair,
} from './render.js';
import * as sfx from './audio.js';

const $ = (id) => document.getElementById(id);

export function createGame() {
  const els = {
    sceneName: $('scene-name'), sceneSub: $('scene-sub'),
    foundCount: $('found-count'), totalCount: $('total-count'), remainCount: $('remain-count'),
    pips: $('found-pips'), timer: $('timer'), score: $('score'),
    hintBtn: $('btn-hint'), hintCount: $('hint-count'),
    pauseBtn: $('btn-pause'), restartBtn: $('btn-restart'), muteBtn: $('btn-mute'),
    toast: $('toast'), overlay: $('overlay'),
    overlayTitle: $('overlay-title'), overlayText: $('overlay-text'),
    overlayStars: $('overlay-stars'), overlayButtons: $('overlay-buttons'),
    holderLeft: $('holder-left'), holderRight: $('holder-right'),
    panelLeft: $('panel-left'), panelRight: $('panel-right'),
  };

  const game = {
    state: 'title', // title | playing | paused | scene-clear | game-over | win
    sceneIndex: 0,
    found: new Set(),
    timeLeft: 0,
    score: 0,
    stars: 0,
    scoreAtSceneStart: 0,
    hintsLeft: 3,
    streak: 0,
    muted: false,
    demo: false,
    timerId: null,
    lastTickSecond: -1,
    panels: null,
    crosshair: { x: 280, y: 230, visible: false },
  };

  // Exposed for automated play-testing (screenshots, self-checks).
  window.CARI_BEDANYA = game;

  function scene() {
    return SCENES[game.sceneIndex];
  }

  function fmtTime(sec) {
    const s = Math.max(0, Math.ceil(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function showToast(text, ms = 1600) {
    els.toast.textContent = text;
    els.toast.classList.add('show');
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => els.toast.classList.remove('show'), ms);
  }

  function updateHUD() {
    const sc = scene();
    els.sceneName.textContent = sc.name;
    els.sceneSub.textContent = sc.sub;
    els.foundCount.textContent = game.found.size;
    els.totalCount.textContent = sc.diffs.length;
    els.remainCount.textContent = sc.diffs.length - game.found.size;
    els.pips.replaceChildren(...sc.diffs.map((d, i) => {
      const pip = document.createElement('span');
      pip.className = 'pip' + (game.found.has(i) ? ' done' : '');
      pip.title = game.found.has(i) ? d.label : 'Belum ketemu';
      return pip;
    }));
    els.timer.textContent = fmtTime(game.timeLeft);
    els.timer.classList.toggle('low', game.state === 'playing' && game.timeLeft <= 10);
    els.timer.classList.toggle('paused', game.state === 'paused' || game.demo);
    els.score.textContent = `Skor ${game.score}`;
    els.hintCount.textContent = game.hintsLeft;
    els.hintBtn.disabled = game.hintsLeft <= 0 || game.state !== 'playing';
  }

  function showOverlay({ title, text, stars = '', buttons }) {
    els.overlayTitle.textContent = title;
    els.overlayText.textContent = text;
    els.overlayStars.textContent = stars;
    els.overlayButtons.replaceChildren(...buttons.map(([label, cls, fn]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      if (cls) b.className = cls;
      b.addEventListener('click', () => { sfx.playClick(); fn(); });
      return b;
    }));
    els.overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    els.overlay.classList.add('hidden');
  }

  function stopTimer() {
    if (game.timerId !== null) {
      window.clearInterval(game.timerId);
      game.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    game.lastTickSecond = -1;
    game.timerId = window.setInterval(() => {
      if (game.state !== 'playing') return;
      game.timeLeft = Math.max(0, game.timeLeft - 0.25);
      const whole = Math.ceil(game.timeLeft);
      if (game.timeLeft <= 10 && whole !== game.lastTickSecond) {
        game.lastTickSecond = whole;
        if (game.timeLeft > 0) sfx.playTick();
      }
      updateHUD();
      if (game.timeLeft <= 0) onTimeOut();
    }, 250);
  }

  function renderScene() {
    const sc = scene();
    const left = makePanel(els.holderLeft, sc);
    const right = makePanel(els.holderRight, sc);
    applyDiffsToRight(right.svg, sc);
    game.panels = { left, right };
    // Re-draw the rings for differences already found (demo mode / scene re-entry).
    for (const i of game.found) {
      const d = sc.diffs[i];
      drawFoundMark(left.marks, d.points[0]);
      drawFoundMark(right.marks, d.points[d.points.length - 1]);
    }
  }

  function startScene(index, preFound = 0) {
    game.sceneIndex = index;
    if (index === 0) {
      // A fresh run from the first scene starts the score over.
      game.score = 0;
      game.stars = 0;
    }
    // Checkpoint: retrying this scene restores the score it started with,
    // so replaying a scene can never farm the same finds twice.
    game.scoreAtSceneStart = game.score;
    game.found = new Set();
    for (let i = 0; i < Math.min(preFound, scene().diffs.length); i++) game.found.add(i);
    // Pre-marked finds (demo mode) count like real ones: same points per
    // find and the same streak, so the score shown matches the counter.
    game.streak = game.found.size;
    game.score += [...game.found].reduce((sum, _, k) => sum + 100 + k * 25, 0);
    game.timeLeft = scene().time;
    game.hintsLeft = 3;
    game.streak = 0;
    game.state = 'playing';
    hideOverlay();
    renderScene();
    updateHUD();
    if (!game.demo) startTimer();
  }

  function starCount() {
    const sc = scene();
    const frac = game.timeLeft / sc.time;
    if (frac >= 0.4) return 3;
    if (frac >= 0.2) return 2;
    return 1;
  }

  function onSceneClear() {
    stopTimer();
    const bonus = Math.round(game.timeLeft) * 5;
    game.score += bonus;
    const stars = starCount();
    game.stars += stars;
    game.state = 'scene-clear';
    sfx.playWin();
    updateHUD();
    const last = game.sceneIndex === SCENES.length - 1;
    showOverlay({
      title: last ? 'Semua Adegan Selesai!' : 'Adegan Selesai! 🎉',
      text: last
        ? `Kamu menemukan semua ${SCENES.reduce((n, s) => n + s.diffs.length, 0)} perbedaan!\nBonus waktu: +${bonus} poin.\nSkor akhir: ${game.score} • Bintang: ${'★'.repeat(game.stars)}`
        : `${scene().name} tuntas — semua perbedaan ketemu!\nBonus waktu: +${bonus} poin.`,
      stars: '★'.repeat(stars) + '☆'.repeat(3 - stars),
      buttons: last
        ? [['Main Lagi', '', () => startScene(0)], ['Menu Utama', 'secondary', showTitle]]
        : [['Adegan Berikutnya →', '', () => startScene(game.sceneIndex + 1)]],
    });
  }

  function onTimeOut() {
    stopTimer();
    game.state = 'game-over';
    sfx.playLose();
    showOverlay({
      title: 'Waktu Habis! ⏰',
      text: `Di ${scene().name} kamu menemukan ${game.found.size} dari ${scene().diffs.length} perbedaan.\nSkor sementara: ${game.score}. Coba lagi — kali ini pasti bisa!`,
      buttons: [
        ['Coba Lagi', '', () => retryScene()],
        ['Menu Utama', 'secondary', showTitle],
      ],
    });
  }

  function retryScene() {
    game.score = game.scoreAtSceneStart;
    startScene(game.sceneIndex);
  }

  function findDiffAt(point) {
    const sc = scene();
    for (let i = 0; i < sc.diffs.length; i++) {
      if (game.found.has(i)) continue;
      for (const p of sc.diffs[i].points) {
        const dx = point.x - p.x;
        const dy = point.y - p.y;
        if (dx * dx + dy * dy <= p.r * p.r) return i;
      }
    }
    return -1;
  }

  function markAt(point, side) {
    if (game.state !== 'playing') return;
    const i = findDiffAt(point);
    if (i >= 0) {
      const d = scene().diffs[i];
      game.found.add(i);
      game.streak += 1;
      const pts = 100 + (game.streak - 1) * 25;
      game.score += pts;
      drawFoundMark(game.panels.left.marks, d.points[0]);
      drawFoundMark(game.panels.right.marks, d.points[d.points.length - 1]);
      sfx.playFind();
      showToast(`Ketemu! ${d.label}  +${pts}`);
      updateHUD();
      if (game.found.size === scene().diffs.length) onSceneClear();
    } else {
      game.streak = 0;
      game.timeLeft = Math.max(0, game.timeLeft - 2);
      const marks = side === 'left' ? game.panels.left.marks : game.panels.right.marks;
      drawMiss(marks, point);
      sfx.playMiss();
      showToast('Bukan di situ! −2 detik');
      updateHUD();
      if (game.timeLeft <= 0) onTimeOut();
    }
  }

  function useHint() {
    if (game.state !== 'playing' || game.hintsLeft <= 0) return;
    const sc = scene();
    const remaining = sc.diffs.map((d, i) => ({ d, i })).filter(({ i }) => !game.found.has(i));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    game.hintsLeft -= 1;
    game.timeLeft = Math.max(1, game.timeLeft - 5);
    drawHintRing(game.panels.left.marks, pick.d.points[0]);
    drawHintRing(game.panels.right.marks, pick.d.points[pick.d.points.length - 1]);
    sfx.playHint();
    showToast(`Petunjuk: ${pick.d.label}… (−5 detik)`, 2200);
    updateHUD();
  }

  function pause() {
    if (game.state !== 'playing') return;
    game.state = 'paused';
    stopTimer();
    updateHUD();
    showOverlay({
      title: 'Jeda ⏸',
      text: 'Istirahat sebentar — waktunya berhenti di sini.',
      buttons: [
        ['Lanjutkan ▶', '', resume],
        ['Menu Utama', 'secondary', showTitle],
      ],
    });
  }

  function resume() {
    if (game.state !== 'paused') return;
    game.state = 'playing';
    hideOverlay();
    startTimer();
    updateHUD();
  }

  function togglePause() {
    if (game.state === 'playing') pause();
    else if (game.state === 'paused') resume();
  }

  function showTitle() {
    stopTimer();
    game.state = 'title';
    game.sceneIndex = 0;
    game.found = new Set();
    game.timeLeft = SCENES[0].time;
    game.score = 0;
    game.stars = 0;
    game.hintsLeft = 3;
    renderScene();
    updateHUD();
    const total = SCENES.reduce((n, s) => n + s.diffs.length, 0);
    showOverlay({
      title: 'Cari Bedanya!',
      text: `Dua gambar hampir sama — ada ${total} perbedaan tersembunyi di 3 adegan.\nKlik perbedaan di gambar A atau B untuk menandainya.\nSemakin cepat ketemu, semakin besar skornya!`,
      buttons: [['▶ Mulai Bermain', '', () => startScene(0)]],
    });
    const list = document.createElement('ul');
    list.className = 'howto';
    list.innerHTML = '<li>🖱️ Klik / Enter — tandai perbedaan</li>'
      + '<li>← ↑ ↓ → — gerakkan bidikan (keyboard)</li>'
      + '<li>💡 H — petunjuk (3× per adegan, −5 detik)</li>'
      + '<li>⏱️ Klik yang meleset −2 detik — hati-hati!</li>';
    els.overlayText.after(list);
  }

  function toggleMute() {
    game.muted = !game.muted;
    sfx.setMuted(game.muted);
    els.muteBtn.textContent = game.muted ? '🔇 Senyap' : '🔊 Suara';
  }

  // Crosshair for keyboard play: one bidikan mirrored on both panels.
  function moveCrosshair(dx, dy) {
    if (game.state !== 'playing') return;
    game.crosshair.visible = true;
    game.crosshair.x = Math.min(556, Math.max(4, game.crosshair.x + dx));
    game.crosshair.y = Math.min(456, Math.max(4, game.crosshair.y + dy));
    drawCrosshair(game.panels.left.marks, game.crosshair);
    drawCrosshair(game.panels.right.marks, game.crosshair);
  }

  function markAtCrosshair() {
    if (game.state !== 'playing' || !game.crosshair.visible) return;
    markAt({ x: game.crosshair.x, y: game.crosshair.y }, 'left');
  }

  els.hintBtn.addEventListener('click', () => useHint());
  els.pauseBtn.addEventListener('click', () => togglePause());
  els.restartBtn.addEventListener('click', () => {
    if (game.state === 'playing' || game.state === 'paused' || game.state === 'game-over') {
      retryScene();
    }
  });
  els.muteBtn.addEventListener('click', () => toggleMute());

  return {
    game, startScene, retryScene, showTitle, markAt, useHint, togglePause, resume,
    moveCrosshair, markAtCrosshair, toggleMute, updateHUD,
  };
}
