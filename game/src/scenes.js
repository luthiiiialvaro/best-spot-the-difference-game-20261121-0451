// Cari Bedanya! — scene art and differences.
// Every scene is drawn from scratch as inline SVG (no copied images). A scene
// returns its base picture (the left panel) plus the list of differences; the
// right panel is the same picture with each difference applied to it.
// A difference may list several hit points (used when an object moved: the old
// spot and the new spot both count as a find).
// Coordinates are in the scene viewBox: 0 0 560 460.

function flower(x, y, petal, id) {
  const petals = [0, 72, 144, 216, 288].map((a) => {
    const r = (a * Math.PI) / 180;
    const px = (x + Math.cos(r) * 13).toFixed(1);
    const py = (y - 8 + Math.sin(r) * 13).toFixed(1);
    return `<circle class="petal" cx="${px}" cy="${py}" r="9" fill="${petal}"/>`;
  }).join('');
  return `<g id="${id}">
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 34}" stroke="#3e9e4d" stroke-width="4"/>
    ${petals}
    <circle cx="${x}" cy="${y - 8}" r="8" fill="#FFD93D"/>
  </g>`;
}

function cloud(x, y, id) {
  return `<g id="${id}" fill="#ffffff" opacity="0.95">
    <ellipse cx="${x}" cy="${y}" rx="34" ry="16"/>
    <ellipse cx="${x - 22}" cy="${y + 6}" rx="22" ry="12"/>
    <ellipse cx="${x + 24}" cy="${y + 6}" rx="24" ry="13"/>
  </g>`;
}

function book(x, y, w, h, color, id) {
  return `<rect id="${id}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${color}" stroke="#00000022" stroke-width="1"/>`;
}

export const SCENES = [
  {
    id: 'garden',
    name: 'Kebun Pagi',
    sub: 'Adegan 1 dari 3',
    time: 120,
    build() {
      return `<defs>
        <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8fd0f5"/><stop offset="1" stop-color="#fdf3c0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="560" height="460" fill="url(#skyGrad1)"/>
      <g id="sun">
        <circle cx="70" cy="70" r="38" fill="#FFD93D"/>
        <g id="sunRays" stroke="#FFD93D" stroke-width="5" stroke-linecap="round">
          <line x1="70" y1="18" x2="70" y2="6"/><line x1="70" y1="122" x2="70" y2="134"/>
          <line x1="18" y1="70" x2="6" y2="70"/><line x1="122" y1="70" x2="134" y2="70"/>
          <line x1="33" y1="33" x2="25" y2="25"/><line x1="107" y1="107" x2="115" y2="115"/>
          <line x1="107" y1="33" x2="115" y2="25"/><line x1="33" y1="107" x2="25" y2="115"/>
        </g>
      </g>
      ${cloud(210, 58, 'cloud1')}
      ${cloud(390, 42, 'cloud2')}
      ${cloud(480, 108, 'cloud3')}
      <ellipse cx="140" cy="486" rx="290" ry="96" fill="#7ec850"/>
      <ellipse cx="460" cy="496" rx="310" ry="104" fill="#5fb84a"/>
      <ellipse cx="280" cy="452" rx="180" ry="16" fill="#e8d29a"/>
      <g id="tree">
        <rect x="90" y="212" width="22" height="112" fill="#8B5A2B"/>
        <circle cx="101" cy="196" r="56" fill="#3e9e4d"/>
        <circle cx="66" cy="228" r="40" fill="#4cb45e"/>
        <circle cx="138" cy="228" r="40" fill="#359245"/>
        <circle id="apple1" cx="80" cy="214" r="7" fill="#e33b2f"/>
        <circle id="apple2" cx="122" cy="188" r="7" fill="#e33b2f"/>
        <circle id="apple3" cx="106" cy="238" r="7" fill="#e33b2f"/>
      </g>
      <g id="fence" fill="#c98f4e" stroke="#a06c33" stroke-width="1">
        <rect x="300" y="330" width="230" height="8" rx="3"/>
        <rect x="300" y="352" width="230" height="8" rx="3"/>
        <rect x="308" y="318" width="14" height="54" rx="3"/>
        <rect x="348" y="318" width="14" height="54" rx="3"/>
        <rect x="388" y="318" width="14" height="54" rx="3"/>
        <rect x="428" y="318" width="14" height="54" rx="3"/>
        <rect x="468" y="318" width="14" height="54" rx="3"/>
        <rect x="508" y="318" width="14" height="54" rx="3"/>
      </g>
      <g id="bird">
        <ellipse cx="352" cy="312" rx="13" ry="9" fill="#5b8dd9"/>
        <circle cx="362" cy="303" r="7" fill="#5b8dd9"/>
        <polygon points="368,303 376,305 368,307" fill="#f6a609"/>
        <circle cx="364" cy="301" r="1.6" fill="#222"/>
      </g>
      ${flower(60, 398, '#e33b2f', 'flower1')}
      ${flower(150, 398, '#f07f13', 'flower2')}
      ${flower(240, 398, '#9b59d0', 'flower3')}
      ${flower(330, 398, '#ef6aa5', 'flower4')}
      ${flower(420, 398, '#f6c90e', 'flower5')}
      <g id="can">
        <rect x="478" y="386" width="42" height="34" rx="6" fill="#2f6fb2"/>
        <polygon points="478,392 452,372 458,366 480,384" fill="#2f6fb2"/>
        <path d="M 520 392 q 14 4 0 16" fill="none" stroke="#2f6fb2" stroke-width="5"/>
      </g>
      <g id="bee">
        <ellipse cx="300" cy="150" rx="13" ry="9" fill="#FFD93D"/>
        <ellipse cx="294" cy="142" rx="8" ry="5" fill="#cfe8ff" opacity="0.9"/>
        <ellipse cx="306" cy="142" rx="8" ry="5" fill="#cfe8ff" opacity="0.9"/>
        <line x1="296" y1="142" x2="296" y2="158" stroke="#222" stroke-width="3"/>
        <line x1="304" y1="142" x2="304" y2="158" stroke="#222" stroke-width="3"/>
      </g>
      <g id="butterfly">
        <ellipse cx="420" cy="176" rx="12" ry="16" fill="#ef6aa5" transform="rotate(-18 420 176)"/>
        <ellipse cx="440" cy="176" rx="12" ry="16" fill="#9b59d0" transform="rotate(18 440 176)"/>
        <rect x="428" y="168" width="5" height="20" rx="2" fill="#5b3a8c"/>
      </g>
      <g stroke="#3e9e4d" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M 30 448 q 4 -12 8 0 M 42 448 q 4 -12 8 0"/>
        <path d="M 500 448 q 4 -12 8 0 M 512 448 q 4 -12 8 0"/>
      </g>`;
    },
    diffs: [
      { id: 'awan', label: 'Awan hilang', points: [{ x: 480, y: 108, r: 34 }],
        apply: (root) => root.querySelector('#cloud3')?.remove() },
      { id: 'bunga', label: 'Warna bunga berubah', points: [{ x: 240, y: 392, r: 26 }],
        apply: (root) => root.querySelectorAll('#flower3 .petal').forEach((p) => p.setAttribute('fill', '#2ec4b6')) },
      { id: 'lebah', label: 'Lebah hilang', points: [{ x: 300, y: 150, r: 22 }],
        apply: (root) => root.querySelector('#bee')?.remove() },
      { id: 'kupu', label: 'Kupu-kupu pindah', points: [{ x: 430, y: 178, r: 26 }, { x: 475, y: 208, r: 26 }],
        apply: (root) => root.querySelector('#butterfly')?.setAttribute('transform', 'translate(45 30)') },
      { id: 'apel', label: 'Apel hilang', points: [{ x: 122, y: 188, r: 14 }],
        apply: (root) => root.querySelector('#apple2')?.remove() },
      { id: 'burung', label: 'Burung hilang', points: [{ x: 352, y: 308, r: 20 }],
        apply: (root) => root.querySelector('#bird')?.remove() },
    ],
  },
  {
    id: 'room',
    name: 'Kamar Kucing',
    sub: 'Adegan 2 dari 3',
    time: 100,
    build() {
      return `<defs>
        <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2c3e6b"/><stop offset="1" stop-color="#7fb2e5"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="560" height="360" fill="#f3d9b0"/>
      <rect x="0" y="360" width="560" height="100" fill="#b08954"/>
      <g id="window">
        <rect x="58" y="48" width="154" height="142" fill="url(#skyGrad2)" stroke="#8B5A2B" stroke-width="6"/>
        <circle cx="152" cy="92" r="22" fill="#fff8c9"/>
        <circle id="star1" cx="88" cy="76" r="4" fill="#fff"/>
        <circle id="star2" cx="120" cy="118" r="4" fill="#fff"/>
        <circle id="star3" cx="182" cy="140" r="4" fill="#fff"/>
        <line x1="135" y1="48" x2="135" y2="190" stroke="#8B5A2B" stroke-width="4"/>
        <line x1="58" y1="119" x2="212" y2="119" stroke="#8B5A2B" stroke-width="4"/>
        <polygon points="48,40 78,40 70,200 48,200" fill="#d96a6a"/>
        <polygon points="222,40 192,40 200,200 222,200" fill="#d96a6a"/>
      </g>
      <g id="clock">
        <circle cx="470" cy="80" r="34" fill="#fffdf6" stroke="#8B5A2B" stroke-width="5"/>
        <line id="handH" x1="470" y1="80" x2="470" y2="62" stroke="#222" stroke-width="4" stroke-linecap="round"/>
        <line id="handM" x1="470" y1="80" x2="488" y2="80" stroke="#222" stroke-width="3" stroke-linecap="round"/>
        <circle cx="470" cy="80" r="3" fill="#222"/>
      </g>
      <g id="shelf">
        <rect x="280" y="58" width="172" height="152" fill="#8B5A2B"/>
        <rect x="288" y="128" width="156" height="6" fill="#6e4423"/>
        ${book(292, 76, 16, 52, '#e33b2f', 'book1')}
        ${book(310, 70, 14, 58, '#2f6fb2', 'book2')}
        ${book(326, 80, 18, 48, '#2e9e5b', 'book3')}
        ${book(346, 72, 14, 56, '#f6a609', 'book4')}
        ${book(362, 78, 16, 50, '#9b59d0', 'book5')}
        ${book(292, 140, 16, 62, '#ef6aa5', 'book6')}
        ${book(310, 146, 14, 56, '#2ec4b6', 'book7')}
        ${book(326, 138, 18, 64, '#f07f13', 'book8')}
      </g>
      <g id="frame">
        <rect x="248" y="216" width="74" height="58" fill="#fffdf6" stroke="#8B5A2B" stroke-width="5"/>
        <circle id="picSun" cx="285" cy="238" r="12" fill="#FFD93D"/>
        <path d="M 256 268 q 12 -14 24 0 q 10 -10 20 2 l 14 -2 v 6 h -58 z" fill="#7ec850"/>
      </g>
      <ellipse cx="280" cy="412" rx="185" ry="30" fill="#d96a6a"/>
      <ellipse cx="280" cy="412" rx="150" ry="20" fill="#e8a0a0"/>
      <g id="cat">
        <ellipse cx="150" cy="392" rx="72" ry="22" fill="#7ec8e3"/>
        <ellipse cx="148" cy="376" rx="50" ry="20" fill="#f5a623"/>
        <circle cx="188" cy="362" r="17" fill="#f5a623"/>
        <polygon points="176,350 180,334 190,348" fill="#f5a623"/>
        <polygon points="192,348 200,334 202,350" fill="#f5a623"/>
        <path d="M 182 360 q 4 3 8 0" stroke="#8a5a00" stroke-width="2" fill="none"/>
        <path id="tail" d="M 100 378 q -26 -4 -22 -26" stroke="#f5a623" stroke-width="9" fill="none" stroke-linecap="round"/>
      </g>
      <g id="yarn">
        <circle cx="92" cy="338" r="16" fill="#e4572e"/>
        <path d="M 92 338 q 30 8 44 26" stroke="#e4572e" stroke-width="2" fill="none"/>
        <path d="M 80 330 q 12 -6 24 0 M 80 344 q 12 6 24 0" stroke="#c23a1d" stroke-width="1.5" fill="none"/>
      </g>
      <g id="desk">
        <rect x="330" y="300" width="184" height="14" fill="#8B5A2B"/>
        <rect x="338" y="314" width="10" height="66" fill="#6e4423"/>
        <rect x="496" y="314" width="10" height="66" fill="#6e4423"/>
        <rect x="356" y="272" width="28" height="28" fill="#e4572e"/>
        <path d="M 384 278 q 10 4 0 14" fill="none" stroke="#e4572e" stroke-width="4"/>
        <g id="steam" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.85">
          <path d="M 364 264 q 4 -8 0 -14 q -4 -6 0 -12"/>
          <path d="M 376 264 q 4 -8 0 -14 q -4 -6 0 -12"/>
        </g>
        <g id="lamp">
          <rect x="440" y="290" width="34" height="10" rx="3" fill="#2f6fb2"/>
          <line x1="457" y1="290" x2="457" y2="252" stroke="#2f6fb2" stroke-width="5"/>
          <polygon points="438,252 476,252 468,226 446,226" fill="#f6a609"/>
        </g>
      </g>
      <g id="plant">
        <polygon points="512,330 540,330 536,362 516,362" fill="#c96a3b"/>
        <ellipse id="leaf1" cx="518" cy="316" rx="8" ry="18" fill="#3e9e4d" transform="rotate(-24 518 316)"/>
        <ellipse id="leaf2" cx="532" cy="308" rx="8" ry="20" fill="#4cb45e"/>
        <ellipse id="leaf3" cx="544" cy="318" rx="8" ry="17" fill="#359245" transform="rotate(24 544 318)"/>
      </g>`;
    },
    diffs: [
      { id: 'jam', label: 'Jarum jam pindah', points: [{ x: 470, y: 80, r: 30 }],
        apply: (root) => root.querySelector('#handH')?.setAttribute('transform', 'rotate(90 470 80)') },
      { id: 'buku', label: 'Warna buku berubah', points: [{ x: 353, y: 100, r: 16 }],
        apply: (root) => root.querySelector('#book4')?.setAttribute('fill', '#2ec4b6') },
      { id: 'ekor', label: 'Ekor kucing pindah', points: [{ x: 86, y: 362, r: 18 }, { x: 112, y: 392, r: 18 }],
        apply: (root) => root.querySelector('#tail')?.setAttribute('d', 'M 100 384 q 4 22 26 20') },
      { id: 'uap', label: 'Uap cangkir hilang', points: [{ x: 370, y: 250, r: 16 }],
        apply: (root) => root.querySelector('#steam')?.remove() },
      { id: 'lukisan', label: 'Matahari di lukisan berubah', points: [{ x: 285, y: 238, r: 16 }],
        apply: (root) => { const s = root.querySelector('#picSun'); if (s) { s.setAttribute('fill', '#b8c4d8'); s.setAttribute('r', '10'); } } },
      { id: 'daun', label: 'Daun tanaman hilang', points: [{ x: 532, y: 308, r: 14 }],
        apply: (root) => root.querySelector('#leaf2')?.remove() },
      { id: 'bintang', label: 'Bintang di jendela hilang', points: [{ x: 120, y: 118, r: 12 }],
        apply: (root) => root.querySelector('#star2')?.remove() },
    ],
  },
  {
    id: 'beach',
    name: 'Pantai Senja',
    sub: 'Adegan 3 dari 3',
    time: 90,
    build() {
      return `<defs>
        <linearGradient id="skyGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff9f43"/><stop offset="0.55" stop-color="#ff7e67"/><stop offset="1" stop-color="#f7c8d8"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="560" height="230" fill="url(#skyGrad3)"/>
      <circle cx="280" cy="150" r="54" fill="#fff3b0"/>
      <circle cx="280" cy="150" r="66" fill="#fff3b0" opacity="0.25"/>
      ${cloud(110, 70, 'cloudA')}
      ${cloud(450, 60, 'cloudB')}
      <rect x="0" y="220" width="560" height="115" fill="#2f6fb2"/>
      <path d="M 0 240 q 35 -12 70 0 t 70 0 t 70 0 t 70 0 t 70 0 t 70 0 t 70 0 t 70 0" stroke="#7fb2e5" stroke-width="4" fill="none"/>
      <path d="M 0 285 q 35 -12 70 0 t 70 0 t 70 0 t 70 0 t 70 0 t 70 0 t 70 0 t 70 0" stroke="#7fb2e5" stroke-width="4" fill="none" opacity="0.7"/>
      <g id="boat">
        <polygon points="400,196 462,196 452,214 412,214" fill="#8B5A2B"/>
        <polygon points="428,196 428,158 458,196" fill="#fffdf6"/>
        <line x1="428" y1="196" x2="428" y2="156" stroke="#8B5A2B" stroke-width="3"/>
      </g>
      <rect x="0" y="330" width="560" height="130" fill="#f2d492"/>
      <ellipse cx="280" cy="338" rx="280" ry="10" fill="#e0bd76"/>
      <g id="palm">
        <path d="M 96 336 q -8 -70 6 -130" stroke="#8B5A2B" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M 102 206 q -44 -26 -72 -6 q 30 26 72 6" fill="#3e9e4d"/>
        <path d="M 102 206 q -8 -46 22 -58 q 6 34 -22 58" fill="#4cb45e"/>
        <path d="M 102 206 q 40 -30 74 -14 q -26 30 -74 14" fill="#359245"/>
        <path d="M 102 206 q 34 6 44 38 q -30 2 -44 -38" fill="#3e9e4d"/>
        <circle id="coconut1" cx="94" cy="196" r="9" fill="#6e4423"/>
        <circle id="coconut2" cx="114" cy="204" r="9" fill="#6e4423"/>
        <circle id="coconut3" cx="88" cy="212" r="9" fill="#6e4423"/>
      </g>
      <g id="umbrella">
        <line x1="400" y1="330" x2="400" y2="196" stroke="#8B5A2B" stroke-width="5"/>
        <path d="M 330 200 q 70 -52 140 0 z" fill="#e33b2f"/>
        <path id="stripe3" d="M 377 182 q 23 -12 46 0 l -6 18 h -34 z" fill="#fffdf6"/>
        <path d="M 400 148 l 0 -12" stroke="#8B5A2B" stroke-width="4"/>
      </g>
      <g id="bucket">
        <polygon points="292,372 332,372 326,408 298,408" fill="#e4572e"/>
        <path d="M 292 372 q 20 12 40 0" fill="none" stroke="#b23a1d" stroke-width="3"/>
        <g id="spade">
          <line x1="338" y1="404" x2="356" y2="372" stroke="#8B5A2B" stroke-width="5"/>
          <polygon points="352,366 366,372 356,384" fill="#f6a609"/>
        </g>
      </g>
      <polygon id="starfish" points="180,364 185,376 198,377 188,386 191,399 180,392 169,399 172,386 162,377 175,376" fill="#ff8c42"/>
      <g id="crab">
        <ellipse cx="480" cy="392" rx="22" ry="14" fill="#e4572e"/>
        <circle cx="462" cy="382" r="7" fill="#e4572e"/>
        <circle cx="498" cy="382" r="7" fill="#e4572e"/>
        <circle cx="472" cy="376" r="3" fill="#222"/>
        <circle cx="488" cy="376" r="3" fill="#222"/>
        <path d="M 462 398 l -12 8 M 498 398 l 12 8" stroke="#e4572e" stroke-width="4" stroke-linecap="round"/>
      </g>
      <g fill="#f7ead0" stroke="#d9b380" stroke-width="1.5">
        <path id="shell1" d="M 140 424 q 10 -14 22 0 q -11 8 -22 0" />
        <path id="shell2" d="M 214 430 q 10 -14 22 0 q -11 8 -22 0" />
        <path id="shell3" d="M 344 424 q 10 -14 22 0 q -11 8 -22 0" />
      </g>
      <g fill="#d9b380">
        <ellipse cx="250" cy="446" rx="7" ry="4" transform="rotate(-18 250 446)"/>
        <ellipse cx="264" cy="440" rx="7" ry="4" transform="rotate(-18 264 440)"/>
        <ellipse cx="278" cy="434" rx="7" ry="4" transform="rotate(-18 278 434)"/>
      </g>`;
    },
    diffs: [
      { id: 'perahu', label: 'Perahu hilang', points: [{ x: 430, y: 192, r: 28 }],
        apply: (root) => root.querySelector('#boat')?.remove() },
      { id: 'kelapa', label: 'Kelapa hilang', points: [{ x: 114, y: 204, r: 12 }],
        apply: (root) => root.querySelector('#coconut2')?.remove() },
      { id: 'payung', label: 'Warna garis payung berubah', points: [{ x: 400, y: 190, r: 20 }],
        apply: (root) => root.querySelector('#stripe3')?.setAttribute('fill', '#2f6fb2') },
      { id: 'bintanglaut', label: 'Bintang laut hilang', points: [{ x: 180, y: 382, r: 20 }],
        apply: (root) => root.querySelector('#starfish')?.remove() },
      { id: 'sekop', label: 'Sekop hilang', points: [{ x: 350, y: 378, r: 16 }],
        apply: (root) => root.querySelector('#spade')?.remove() },
      { id: 'kepiting', label: 'Kepiting pindah', points: [{ x: 480, y: 388, r: 24 }, { x: 515, y: 388, r: 24 }],
        apply: (root) => root.querySelector('#crab')?.setAttribute('transform', 'translate(35 0)') },
      { id: 'kerang', label: 'Kerang hilang', points: [{ x: 225, y: 428, r: 12 }],
        apply: (root) => root.querySelector('#shell2')?.remove() },
    ],
  },
];
