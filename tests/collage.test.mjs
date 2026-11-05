import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../src/design-system/bundle.js';

const SI = globalThis.SupergraphicIndex;

/* A home feed shaped like the real one: plates with a label each, some news
   cards hung on a plate, one free-floating card. Sizes in collage units. */
function feed() {
  const items = [];
  const plates = ['ubistat', 'cpap-pi', 'plp', 'robots', 'biohybrid', 'care'];
  plates.forEach((p, i) => {
    items.push({ key: p, kind: 'plate', width: 100, height: 100 / (i === 0 ? 2 : 16 / 9) });
    items.push({ key: p + ':label', kind: 'label', host: p, width: 40 + (i % 3) * 4, height: 7 + (i % 2) * 4 });
    if (i === 1) items.push({ key: 'news:chop', kind: 'card', host: p, width: 34, height: 15 });
    if (i === 1) items.push({ key: 'news:chop-2', kind: 'card', host: p, width: 32, height: 12 });
  });
  items.push({ key: 'news:phd', kind: 'card', width: 42, height: 12 });
  return items;
}

const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

function checkNoForbiddenOverlap(items, positions) {
  const byKey = Object.fromEntries(items.map((it) => [it.key, it]));
  const keys = Object.keys(positions);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = keys[i], b = keys[j];
      if (!overlaps(positions[a], positions[b])) continue;
      const allowed = byKey[a].host === b || byKey[b].host === a;
      assert.ok(allowed, `${a} overlaps ${b}`);
    }
  }
}

test('the same seed gives the same layout', () => {
  const a = SI.layoutCollage(feed(), { seed: 'xinye' });
  const b = SI.layoutCollage(feed(), { seed: 'xinye' });
  assert.deepEqual(a, b);
});

test('a different seed moves things', () => {
  const a = SI.layoutCollage(feed(), { seed: 'xinye' });
  const b = SI.layoutCollage(feed(), { seed: 'another' });
  assert.notDeepEqual(a.positions, b.positions);
});

test('every item is placed and nothing overlaps except an item on its host', () => {
  for (const seed of ['xinye', 'a', 'b', 'c', 'd', 'e', 'f', 'g']) {
    const items = feed();
    const { positions, height } = SI.layoutCollage(items, { seed });
    assert.equal(Object.keys(positions).length, items.length, `seed ${seed}`);
    checkNoForbiddenOverlap(items, positions);
    for (const p of Object.values(positions)) {
      assert.ok(p.x >= 0 && p.x + p.w <= 100 + 1e-6, 'inside the width');
      assert.ok(p.y + p.h <= height + 1e-6, 'inside the height');
    }
  }
});

test('labels sit inside their plate, cards hang over its lower edge', () => {
  const items = feed();
  const { positions } = SI.layoutCollage(items, { seed: 'xinye' });
  for (const it of items) {
    const p = positions[it.key];
    if (!it.host) continue;
    const h = positions[it.host];
    if (p.how === 'below') continue;
    if (it.kind === 'label') {
      assert.ok(p.x >= h.x && p.x + p.w <= h.x + h.w && p.y >= h.y && p.y + p.h <= h.y + h.h, `${it.key} inside host`);
    } else {
      assert.ok(p.y < h.y + h.h && p.y + p.h > h.y + h.h, `${it.key} crosses the host edge`);
    }
  }
});

test('a crowded plate pushes extra labels below instead of dropping them', () => {
  const items = [{ key: 'p', kind: 'plate', width: 100, height: 20 }];
  for (let i = 0; i < 12; i++) items.push({ key: 'l' + i, kind: 'label', host: 'p', width: 48, height: 9 });
  const { positions } = SI.layoutCollage(items, { seed: 'crowd' });
  assert.equal(Object.keys(positions).length, items.length);
  assert.ok(Object.values(positions).some((p) => p.how === 'below'));
  checkNoForbiddenOverlap(items, positions);
});

test('a given position wins, relative to the host for labels', () => {
  const items = [
    { key: 'p', kind: 'plate', width: 100, height: 50 },
    { key: 'l', kind: 'label', host: 'p', width: 35, height: 8, x: 23, y: 27 }
  ];
  const { positions } = SI.layoutCollage(items, { seed: 'x' });
  assert.equal(positions.l.x, 23);
  assert.equal(positions.l.y, 27);
  assert.equal(positions.l.how, 'manual');
});

test('the query is collapsed and capped at 50 characters', () => {
  assert.equal(SI.cleanQuery('  wireless    potentiostat  '), 'wireless potentiostat');
  assert.equal(SI.cleanQuery('x'.repeat(80)).length, 50);
});

test('search matches every typed word, in any order and case', () => {
  const text = 'Pressure-injury sensing mask for pediatric CPAP Sensing Health';
  assert.equal(SI.matchesQuery(text, 'mask cpap'), true);
  assert.equal(SI.matchesQuery(text, '  HEALTH   pressure '), true);
  assert.equal(SI.matchesQuery(text, 'mask robots'), false);
  assert.equal(SI.matchesQuery(text, ''), true);
  assert.equal(SI.matchesQuery(text, null), true);
});
