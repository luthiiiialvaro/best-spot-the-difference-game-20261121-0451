// Cari Bedanya! — builds the two picture panels from a scene and draws marks.
// The left panel is the scene as drawn; the right panel is the same picture
// with every difference applied. Marks (found rings, miss crosses, hint rings
// and the keyboard crosshair) are drawn into an overlay group per panel.

const VIEWBOX = '0 0 560 460';

export function makePanel(holder, scene) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', VIEWBOX);
  svg.setAttribute('role', 'img');
  svg.innerHTML = scene.build();
  const marks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  marks.setAttribute('class', 'marks');
  svg.appendChild(marks);
  holder.replaceChildren(svg);
  return { svg, marks };
}

export function applyDiffsToRight(rightSvg, scene) {
  for (const diff of scene.diffs) diff.apply(rightSvg);
}

export function toViewCoords(svg, clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * 560,
    y: ((clientY - rect.top) / rect.height) * 460,
  };
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

export function drawFoundMark(marks, point) {
  const r = point.r + 7;
  marks.appendChild(el('circle', { class: 'mark-ring', cx: point.x, cy: point.y, r }));
  marks.appendChild(el('path', {
    class: 'mark-check',
    d: `M ${point.x - r * 0.45} ${point.y} l ${r * 0.28} ${r * 0.32} l ${r * 0.55} -${r * 0.6}`,
  }));
}

export function drawMiss(marks, point) {
  const s = 11;
  const g = el('g', { class: 'miss-x' });
  g.appendChild(el('line', { x1: point.x - s, y1: point.y - s, x2: point.x + s, y2: point.y + s }));
  g.appendChild(el('line', { x1: point.x + s, y1: point.y - s, x2: point.x - s, y2: point.y + s }));
  marks.appendChild(g);
  window.setTimeout(() => g.remove(), 650);
}

export function drawHintRing(marks, point) {
  const ring = el('circle', { class: 'hint-ring', cx: point.x, cy: point.y, r: point.r + 10 });
  marks.appendChild(ring);
  window.setTimeout(() => ring.remove(), 2000);
  return ring;
}

export function clearMarks(marks) {
  marks.replaceChildren();
}

export function drawCrosshair(marks, point) {
  const old = marks.querySelector('.crosshair, .crosshair-dot');
  old?.remove();
  const g = el('g', {});
  const c = el('circle', { class: 'crosshair', cx: point.x, cy: point.y, r: 14 });
  const v = el('line', { class: 'crosshair', x1: point.x, y1: point.y - 20, x2: point.x, y2: point.y + 20 });
  const h = el('line', { class: 'crosshair', x1: point.x - 20, y1: point.y, x2: point.x + 20, y2: point.y });
  const dot = el('circle', { class: 'crosshair-dot', cx: point.x, cy: point.y, r: 3 });
  g.append(c, v, h, dot);
  marks.appendChild(g);
  return g;
}
