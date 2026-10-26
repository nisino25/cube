// Blind (Speffz / Old Pochmann) memo logic, ported from the blind-cube trainer.
// Stickers are simulated on a solved cube; the memo is traced from the buffers
// B (edges) and A (corners) and written as Speffz letters A-X.
export const FACES = {
  U: { n: [0, 1, 0],  r: [1, 0, 0],  d: [0, 0, 1],  color: '#ffffff' },
  D: { n: [0, -1, 0], r: [1, 0, 0],  d: [0, 0, -1], color: '#ffd500' },
  F: { n: [0, 0, 1],  r: [1, 0, 0],  d: [0, -1, 0], color: '#009b48' },
  B: { n: [0, 0, -1], r: [-1, 0, 0], d: [0, -1, 0], color: '#0046ad' },
  R: { n: [1, 0, 0],  r: [0, 0, -1], d: [0, -1, 0], color: '#b71234' },
  L: { n: [-1, 0, 0], r: [0, 0, 1],  d: [0, -1, 0], color: '#ff5800' },
};
export const AXIS = { U: 'y', D: 'y', R: 'x', L: 'x', F: 'z', B: 'z' };

export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const faceletPos = (f, row, col) =>
  [0, 1, 2].map(k => f.n[k] + f.r[k] * (col - 1) + f.d[k] * (row - 1));

export const solvedStickers = () => {
  const list = [];
  for (const name in FACES) {
    const f = FACES[name];
    for (let i = 0; i < 9; i++) {
      list.push({ pos: faceletPos(f, Math.floor(i / 3), i % 3), n: [...f.n], color: f.color, home: name + i });
    }
  }
  return list;
};

// Clockwise quarter turn (looking at the face) = -90° about its outward normal a:
// v' = a(a·v) - a×v
export const turn = (stickers, face, times) => {
  const a = FACES[face].n;
  const rot = v => { const c = cross(a, v), k = dot(a, v); return [0, 1, 2].map(i => a[i] * k - c[i]); };
  for (let t = 0; t < times; t++) {
    stickers.forEach(s => {
      if (dot(s.pos, a) === 1) { s.pos = rot(s.pos); s.n = rot(s.n); }
    });
  }
};

export const stickersToFaces = (stickers) => {
  const lookup = {};
  stickers.forEach(s => { lookup[s.pos.join() + '|' + s.n.join()] = s.color; });
  const out = {};
  for (const name in FACES) {
    const f = FACES[name];
    out[name] = Array.from({ length: 9 }, (_, i) =>
      lookup[faceletPos(f, Math.floor(i / 3), i % 3).join() + '|' + f.n.join()]);
  }
  return out;
};

export const parseMoves = (text) => {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens.map(tok => {
    const m = tok.match(/^([URFDLB])(2|'|’)?$/);
    if (!m) throw new Error(`Unknown move: ${tok}`);
    return { face: m[1], times: m[2] === '2' ? 2 : m[2] ? 3 : 1 };
  });
};

export const randomScramble = (length = 20) => {
  const faces = Object.keys(FACES);
  const suffixes = ['', "'", '2'];
  const moves = [];
  while (moves.length < length) {
    const face = faces[Math.floor(Math.random() * 6)];
    const last = moves[moves.length - 1];
    const prev = moves[moves.length - 2];
    if (last && last.face === face) continue;
    // avoid e.g. "R L R" (same axis three in a row)
    if (last && prev && AXIS[last.face] === AXIS[face] && AXIS[prev.face] === AXIS[face]) continue;
    moves.push({ face, suffix: suffixes[Math.floor(Math.random() * 3)] });
  }
  return moves.map(m => m.face + m.suffix).join(' ');
};

// ---- Speffz memo tracing (Old Pochmann) ----
// Letters go clockwise from the top-left of each face in net orientation: U, L, F, R, B, D.
export const SPEFFZ_FACES = ['U', 'L', 'F', 'R', 'B', 'D'];
export const CORNER_IDX = [0, 2, 8, 6];
export const EDGE_IDX = [1, 5, 7, 3];
export const slotLetter = {};
SPEFFZ_FACES.forEach((f, fi) => {
  CORNER_IDX.forEach((idx, k) => { slotLetter[f + idx] = String.fromCharCode(65 + fi * 4 + k); });
  EDGE_IDX.forEach((idx, k) => { slotLetter[f + idx] = String.fromCharCode(65 + fi * 4 + k); });
});

export const traceMemo = (stickers, idxList, buffer) => {
  const homeAt = {};
  stickers.forEach(s => { homeAt[s.pos.join() + '|' + s.n.join()] = s.home; });
  const cur = {};   // slot letter -> letter of the sticker currently sitting there
  const piece = {}; // slot letter -> piece id (cubie position)
  SPEFFZ_FACES.forEach(f => idxList.forEach(i => {
    const fd = FACES[f];
    const pos = faceletPos(fd, Math.floor(i / 3), i % 3);
    const L = slotLetter[f + i];
    cur[L] = slotLetter[homeAt[pos.join() + '|' + fd.n.join()]];
    piece[L] = pos.join();
  }));
  const letters = Object.keys(cur).sort();
  const isSolved = p => letters.every(L => piece[L] !== p || cur[L] === L);

  const memo = [];
  const done = new Set([piece[buffer]]);
  let s = cur[buffer];
  while (piece[s] !== piece[buffer]) { memo.push(s); done.add(piece[s]); s = cur[s]; }

  // cycle breaks: new cycle starts at the first unsolved piece, closes back on that piece
  for (const L of letters) {
    const p = piece[L];
    if (done.has(p) || isSolved(p)) continue;
    done.add(p);
    memo.push(L);
    s = cur[L];
    while (piece[s] !== p) { memo.push(s); done.add(piece[s]); s = cur[s]; }
    memo.push(s);
  }
  return memo;
};


export function computeMemo(scrambleText) {
  const stickers = solvedStickers()
  parseMoves(scrambleText).forEach((m) => turn(stickers, m.face, m.times))
  return {
    edges: traceMemo(stickers, EDGE_IDX, 'B').join(''),
    corners: traceMemo(stickers, CORNER_IDX, 'A').join(''),
  }
}
