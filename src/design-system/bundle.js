/* @ds-bundle: {"format":4,"namespace":"SupergraphicIndex","components":[]} */
/* Supergraphic Index — behaviors for the CSS components. No framework, no network. */
(function (root) {
  'use strict';
  var NS = { version: '2.0.0' };
  var doc = root.document;

  function each(list, fn) { Array.prototype.forEach.call(list || [], fn); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function px(n) { return n.toFixed(2) + 'px'; }

  /* ---------- seeded randomness ---------- */
  NS.hash = function (str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  /* mulberry32: the same seed gives the same sequence on every machine */
  NS.seededRandom = function (seed) {
    var a = (typeof seed === 'number' ? seed : NS.hash(String(seed))) >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /* ---------- nav: fit the words to the row ---------- */
  /* Measures against the nav's own content box (clientWidth), not 100vw, so a page
     scrollbar never pushes the row past the edge. Sets --si-nav-size in px and
     publishes the nav's height as --si-nav-height on <html>. */
  NS.fitNav = function (nav, fill) {
    if (!nav) return;
    fill = fill || parseFloat(nav.getAttribute('data-si-fill')) || 0.92;
    var words = nav.querySelectorAll('.si-nav__word');
    if (!words.length) return;
    var cs = root.getComputedStyle(nav);
    var avail = nav.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (avail <= 0) return;
    nav.style.setProperty('--si-nav-size', '100px');
    var total = 0;
    each(words, function (w) { total += w.getBoundingClientRect().width; });
    if (!total) return;
    nav.style.setProperty('--si-nav-size', px(fill * avail * 100 / total));
    var row = nav.querySelector('.si-nav__row');
    if (row) {
      var fixed = cs.position === 'fixed' || cs.position === 'absolute';
      var bottom = row.offsetHeight + parseFloat(cs.paddingTop) + (fixed ? (parseFloat(cs.top) || 0) : 0);
      doc.documentElement.style.setProperty('--si-nav-height', px(bottom));
    }
  };

  /* ---------- nav: headroom tuck that follows the scroll ---------- */
  /* Every scrolled pixel moves the words by a pixel, down scrolls up, up scrolls
     down, capped at extra + ratio x the word height (10px + 83% by default). The
     home word and the current word stay unless the nav has si-nav--keep-current. */
  NS.tuckNav = function (nav, options) {
    if (!nav) return function () {};
    options = options || {};
    var ratio = options.ratio == null ? 0.83 : options.ratio;
    var extra = options.extra == null ? 10 : options.extra;
    var offset = 0, max = 0, frame = 0;
    var lastY = Math.max(0, root.scrollY || 0);
    function measure() {
      var w = nav.querySelector('.si-nav__word');
      max = w ? Math.floor(extra + w.offsetHeight * ratio) : 0;
    }
    function write() {
      nav.style.setProperty('--si-tuck', px(-offset));
      nav.classList.toggle('is-tucked', max > 0 && offset >= max);
    }
    function apply() {
      frame = 0;
      var y = Math.max(0, root.scrollY || 0);
      offset = clamp(offset + (y - lastY), 0, max);
      lastY = y;
      write();
    }
    function onScroll() { if (!frame) frame = root.requestAnimationFrame(apply); }
    function onResize() { measure(); offset = clamp(offset, 0, max); write(); }
    measure();
    offset = clamp(lastY, 0, max);
    write();
    root.addEventListener('scroll', onScroll, { passive: true });
    root.addEventListener('resize', onResize);
    return function () {
      root.removeEventListener('scroll', onScroll);
      root.removeEventListener('resize', onResize);
      if (frame) root.cancelAnimationFrame(frame);
    };
  };

  /* ---------- nav: ink over imagery ---------- */
  /* An element marked data-si-ground="dark" or "light" sets the nav ink while it
     sits under the words; "background" decides from the element's own background
     color (for inverted bands, whose color flips with the theme). Only elements
     wider than 70% of the page count, and the first one in document order wins. */
  function backgroundGround(el) {
    var m = (root.getComputedStyle(el).backgroundColor || '').match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3 || (m.length > 3 && parseFloat(m[3]) === 0)) return null;
    return 0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2] < 128 ? 'dark' : 'light';
  }
  NS.watchGround = function (nav, options) {
    if (!nav) return function () {};
    options = options || {};
    var minWidth = options.minWidth == null ? 0.7 : options.minWidth;
    var targets = [], frame = 0;
    function collect() { targets = Array.prototype.slice.call(doc.querySelectorAll('[data-si-ground="dark"], [data-si-ground="light"], [data-si-ground="background"]')); }
    function update() {
      frame = 0;
      var row = nav.querySelector('.si-nav__row') || nav;
      var band = row.getBoundingClientRect();
      var top = Math.max(0, band.top), bottom = Math.max(top + 1, band.bottom);
      var pageW = doc.documentElement.clientWidth;
      var ground = null;
      for (var i = 0; i < targets.length; i++) {
        var r = targets[i].getBoundingClientRect();
        if (r.width > pageW * minWidth && r.bottom > top + (bottom - top) * 0.7 && r.top < bottom) {
          ground = targets[i].getAttribute('data-si-ground');
          if (ground === 'background') ground = backgroundGround(targets[i]);
          break;
        }
      }
      nav.classList.toggle('si-nav--on-dark', ground === 'dark');
      nav.classList.toggle('si-nav--on-light', ground === 'light');
    }
    function schedule() { if (!frame) frame = root.requestAnimationFrame(update); }
    collect();
    update();
    root.addEventListener('scroll', schedule, { passive: true });
    root.addEventListener('resize', schedule);
    var mo = root.MutationObserver ? new root.MutationObserver(function () { collect(); schedule(); }) : null;
    if (mo) mo.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-si-ground'] });
    return function () {
      root.removeEventListener('scroll', schedule);
      root.removeEventListener('resize', schedule);
      if (mo) mo.disconnect();
      if (frame) root.cancelAnimationFrame(frame);
    };
  };

  /* ---------- image brightness ---------- */
  /* Mean luma (0-255) of the top band of an image. A top band darker than 157
     takes white ink, as on the source site. Same-origin images only. */
  NS.groundThreshold = 157;
  NS.topBrightness = function (img, band) {
    band = band || 0.15;
    var w = 64, h = Math.max(1, Math.round(64 * img.naturalHeight / img.naturalWidth));
    var canvas = doc.createElement('canvas');
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    var rows = Math.max(1, Math.round(h * band));
    var data = ctx.getImageData(0, 0, w, rows).data;
    var sum = 0;
    for (var i = 0; i < data.length; i += 4) sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    return sum / (data.length / 4);
  };
  /* Elements marked data-si-ground="auto" get dark or light once their image loads. */
  NS.analyzeGround = function (scope) {
    each((scope || doc).querySelectorAll('[data-si-ground="auto"]'), function (el) {
      var img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (!img) return;
      var run = function () {
        try {
          el.setAttribute('data-si-ground', NS.topBrightness(img) < NS.groundThreshold ? 'dark' : 'light');
        } catch (e) { /* cross-origin image: leave it as auto */ }
      };
      if (img.complete && img.naturalWidth) run(); else img.addEventListener('load', run, { once: true });
    });
  };

  /* ---------- search ---------- */
  /* The element with data-si-search opens .si-search; Escape closes it. Typing
     settles for 350ms, then the cleaned query (spaces collapsed, at most 50
     characters) is sent as a si:search event on the nav. */
  NS.cleanQuery = function (q) { return (String(q || '').match(/\S+/g) || []).join(' ').slice(0, 50); };
  NS.search = function (nav) {
    if (!nav) return;
    var trigger = nav.querySelector('[data-si-search]');
    var input = nav.querySelector('.si-search__input');
    if (!trigger || !input) return;
    var timer = 0;
    function open(state) {
      nav.classList.toggle('is-searching', state);
      trigger.setAttribute('aria-expanded', String(state));
      if (state) input.focus(); else trigger.focus();
    }
    trigger.addEventListener('click', function (e) { e.preventDefault(); open(!nav.classList.contains('is-searching')); });
    input.addEventListener('input', function () {
      root.clearTimeout(timer);
      timer = root.setTimeout(function () {
        nav.dispatchEvent(new root.CustomEvent('si:search', { bubbles: true, detail: { query: NS.cleanQuery(input.value) } }));
      }, 350);
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
  };

  /* ---------- filters, text search and views, kept in the URL ---------- */
  /* Buttons (.si-toggle, .si-view__button) with data-si-param and data-si-value set
     ?param=value; pressing the active one clears it. A text input with data-si-param
     sets ?param=words after typing settles for 350ms; Escape clears it. So a
     filtered view can be shared and the back button works.
     Items with data-si-filterable stay visible when they carry every chosen value
     (data-si-filter-<param>="a b") and contain every typed word (data-si-text, or
     their text). [data-si-filter-group] hides when none of its items show, and
     [data-si-empty] shows when nothing does. data-si-param="view" adds
     si-index--<value> to [data-si-view-target]. */
  NS.readParams = function () { return new root.URLSearchParams(root.location.search); };
  NS.matchesQuery = function (text, query) {
    var words = NS.cleanQuery(query).toLowerCase().split(' ').filter(Boolean);
    text = String(text || '').toLowerCase();
    return words.every(function (w) { return text.indexOf(w) >= 0; });
  };
  function buttons(scope) { return scope.querySelectorAll('.si-toggle[data-si-param], .si-view__button[data-si-param]'); }
  function fields(scope) { return scope.querySelectorAll('input[data-si-param]'); }
  function writeParams(params, push) {
    var qs = params.toString();
    root.history[push ? 'pushState' : 'replaceState'](null, '', root.location.pathname + (qs ? '?' + qs : '') + root.location.hash);
  }
  NS.applyFilters = function (scope) {
    scope = scope || doc;
    var params = NS.readParams();
    var filterKeys = [], textKeys = [];
    each(buttons(scope), function (b) {
      var p = b.getAttribute('data-si-param'), v = b.getAttribute('data-si-value');
      var current = params.get(p) || (b.hasAttribute('data-si-default') ? v : null);
      b.setAttribute('aria-pressed', String(current === v));
      if (p !== 'view' && filterKeys.indexOf(p) < 0) filterKeys.push(p);
    });
    each(fields(scope), function (f) {
      var p = f.getAttribute('data-si-param');
      if (f !== doc.activeElement) f.value = params.get(p) || '';
      if (textKeys.indexOf(p) < 0) textKeys.push(p);
    });
    var shown = 0, total = 0;
    each(scope.querySelectorAll('[data-si-filterable]'), function (item) {
      var show = filterKeys.every(function (p) {
        var want = params.get(p);
        if (!want) return true;
        return (item.getAttribute('data-si-filter-' + p) || '').split(/\s+/).indexOf(want) >= 0;
      }) && textKeys.every(function (p) {
        return NS.matchesQuery(item.getAttribute('data-si-text') || item.textContent, params.get(p));
      });
      item.hidden = !show;
      total++;
      if (show) shown++;
    });
    each(scope.querySelectorAll('[data-si-filter-group]'), function (group) {
      group.hidden = group.querySelectorAll('[data-si-filterable]:not([hidden])').length === 0;
    });
    each(scope.querySelectorAll('[data-si-empty]'), function (el) { el.hidden = shown > 0 || total === 0; });
    var view = params.get('view');
    each(scope.querySelectorAll('[data-si-view-target]'), function (t) {
      each(scope.querySelectorAll('[data-si-param="view"]'), function (b) {
        t.classList.toggle('si-index--' + b.getAttribute('data-si-value'), view === b.getAttribute('data-si-value') && !b.hasAttribute('data-si-default'));
      });
    });
  };
  NS.toggles = function (scope) {
    scope = scope || doc;
    scope.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.si-toggle, .si-view__button') : null;
      if (!b || !scope.contains(b)) return;
      var p = b.getAttribute('data-si-param');
      if (p) {
        var params = NS.readParams();
        var v = b.getAttribute('data-si-value');
        if (params.get(p) === v || b.hasAttribute('data-si-default')) params.delete(p); else params.set(p, v);
        writeParams(params, true);
        NS.applyFilters(scope);
        return;
      }
      var group = b.getAttribute('data-si-group');
      if (group) each(scope.querySelectorAll('[data-si-group="' + group + '"]'), function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      else b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
    each(fields(scope), function (f) {
      var timer = 0;
      function commit() {
        root.clearTimeout(timer);
        var params = NS.readParams(), p = f.getAttribute('data-si-param'), q = NS.cleanQuery(f.value);
        if (q) params.set(p, q); else params.delete(p);
        writeParams(params, false);
        NS.applyFilters(scope);
        f.dispatchEvent(new root.CustomEvent('si:search', { bubbles: true, detail: { query: q } }));
      }
      f.addEventListener('input', function () { root.clearTimeout(timer); timer = root.setTimeout(commit, 350); });
      f.addEventListener('keydown', function (e) { if (e.key === 'Escape' && f.value) { e.preventDefault(); f.value = ''; commit(); } });
      if (f.form) f.form.addEventListener('submit', function (e) { e.preventDefault(); commit(); });
    });
    root.addEventListener('popstate', function () { NS.applyFilters(scope); });
    NS.applyFilters(scope);
  };

  /* ---------- collage: seeded placement, nothing dropped ---------- */
  /* Pure layout in a space 100 units wide (1 unit = 1% of the container width).
     items: [{key, kind: 'plate' | 'label' | 'card', width, height, host?, x?, y?}]
     - plate: stacked below everything placed so far; narrower plates take a seeded side.
     - label: dropped onto its host plate, in the middle band, clear of other labels and cards.
     - card: hung over its host's lower edge, or into free space when it has no host.
     A given x/y (labels: relative to the host) wins. When every try fails the item
     goes below the stack instead of disappearing. Returns {positions, height}. */
  NS.layoutCollage = function (items, options) {
    options = options || {};
    var rand = NS.seededRandom(options.seed == null ? 'supergraphic' : options.seed);
    var W = 100, gap = options.gap == null ? 4 : options.gap, margin = options.margin == null ? 3 : options.margin;
    var tries = options.tries || 100;
    var placed = [], byKey = {}, floor = 0;
    function overlaps(a, b) { return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; }
    function free(r, ignore) {
      for (var i = 0; i < placed.length; i++) {
        var p = placed[i];
        if (ignore && ignore.indexOf(p.key) >= 0) continue;
        if (overlaps(r, p)) return false;
      }
      return r.x >= 0 && r.x + r.w <= W + 1e-6 && r.y >= 0;
    }
    function put(it, x, y, how) {
      var r = { key: it.key, kind: it.kind, host: it.host || null, x: x, y: y, w: it.width, h: it.height, how: how };
      placed.push(r); byKey[it.key] = r;
      floor = Math.max(floor, y + it.height);
      return r;
    }
    function below(it) {
      var x = it.width >= W ? 0 : (rand() < 0.5 ? margin : W - margin - it.width);
      return put(it, Math.max(0, x), placed.length ? floor + gap : 0, 'below');
    }
    items.forEach(function (it) {
      if (byKey[it.key]) throw new Error('Duplicate collage key: ' + it.key);
      var host = it.host ? byKey[it.host] : null;
      if (it.x != null && it.y != null) {
        var ox = host ? host.x + it.x : it.x, oy = host ? host.y + it.y : it.y;
        put(it, ox, oy, 'manual');
        return;
      }
      if (it.kind === 'plate' || (!host && it.kind !== 'card')) { below(it); return; }
      var i, r, ignore = host ? [host.key] : [];
      if (it.kind === 'label' && host) {
        for (i = 0; i < tries; i++) {
          r = { x: host.x + rand() * Math.max(0, host.w - it.width), y: host.y + host.h * 0.12 + rand() * Math.max(0, host.h * 0.76 - it.height), w: it.width, h: it.height };
          if (r.y + r.h <= host.y + host.h && free(r, ignore)) { put(it, r.x, r.y, 'on-host'); return; }
        }
        below(it); return;
      }
      if (it.kind === 'card' && host) {
        for (i = 0; i < tries; i++) {
          var overlap = Math.min(host.h * 0.5, 4 + rand() * 7);
          r = { x: margin + rand() * Math.max(0, W - 2 * margin - it.width), y: host.y + host.h - overlap, w: it.width, h: it.height };
          if (free(r, ignore)) { put(it, r.x, r.y, 'host-edge'); return; }
        }
        below(it); return;
      }
      /* floating card: the highest free slot, on a seeded side */
      var ys = [0].concat(placed.map(function (p) { return p.y + p.h + gap; })).sort(function (a, b) { return a - b; });
      for (i = 0; i < ys.length; i++) {
        var left = rand() < 0.5;
        var xs = left ? [margin, W - margin - it.width] : [W - margin - it.width, margin];
        for (var j = 0; j < xs.length; j++) {
          r = { x: xs[j], y: ys[i], w: it.width, h: it.height };
          if (free(r)) { put(it, r.x, r.y, 'free'); return; }
        }
      }
      below(it);
    });
    var positions = {};
    placed.forEach(function (p) { positions[p.key] = { x: p.x, y: p.y, w: p.w, h: p.h, how: p.how }; });
    return { positions: positions, height: floor };
  };

  /* DOM side: children with data-kind (plate | label | card), data-key, data-host,
     optional data-width, data-x, data-y. Widths without data-width are seeded:
     labels 40-50 units, cards on a host 30-40, free cards 40-45. Below 768px the
     items stay in normal flow. */
  NS.collage = function (container, options) {
    if (!container) return function () {};
    options = options || {};
    var seed = container.getAttribute('data-seed') || options.seed || 'supergraphic';
    var mq = root.matchMedia ? root.matchMedia('(min-width: 768px)') : { matches: true };
    var nodes = Array.prototype.slice.call(container.querySelectorAll(':scope > [data-kind]'));
    var timer = 0;
    function widthFor(el, rand) {
      var given = parseFloat(el.getAttribute('data-width'));
      if (!isNaN(given)) return given;
      var kind = el.getAttribute('data-kind');
      if (kind === 'plate') return 100;
      if (kind === 'label') return 40 + rand() * 10;
      return el.getAttribute('data-host') ? 30 + rand() * 10 : 40 + rand() * 5;
    }
    function reset() {
      container.classList.remove('is-laid-out');
      container.style.height = '';
      nodes.forEach(function (el) { el.style.left = el.style.top = el.style.width = ''; });
    }
    function layout() {
      if (!mq.matches) { reset(); return; }
      var unit = container.clientWidth / 100;
      if (!unit) return;
      container.style.setProperty('--si-u', px(unit));
      container.classList.add('is-laid-out');
      var rand = NS.seededRandom(seed + ':widths');
      var items = nodes.map(function (el, i) {
        var w = widthFor(el, rand);
        el.style.width = w + '%';
        var x = el.getAttribute('data-x'), y = el.getAttribute('data-y');
        return {
          key: el.getAttribute('data-key') || ('item-' + i), kind: el.getAttribute('data-kind'), host: el.getAttribute('data-host') || null,
          width: w, height: el.offsetHeight / unit,
          x: x == null ? null : parseFloat(x), y: y == null ? null : parseFloat(y)
        };
      });
      var result = NS.layoutCollage(items, { seed: seed, gap: options.gap, margin: options.margin });
      nodes.forEach(function (el, i) {
        var p = result.positions[items[i].key];
        el.style.left = p.x + '%';
        el.style.top = 'calc(var(--si-u) * ' + p.y.toFixed(3) + ')';
      });
      container.style.height = 'calc(var(--si-u) * ' + (result.height + (options.gap == null ? 4 : options.gap)).toFixed(3) + ')';
      container.dispatchEvent(new root.CustomEvent('si:collage', { bubbles: true, detail: result }));
    }
    function schedule() { root.clearTimeout(timer); timer = root.setTimeout(layout, 120); }
    layout();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layout);
    nodes.forEach(function (el) { each(el.querySelectorAll('img'), function (img) { if (!img.complete) img.addEventListener('load', schedule, { once: true }); }); });
    root.addEventListener('resize', schedule);
    return function () { root.removeEventListener('resize', schedule); reset(); };
  };

  /* ---------- wire everything ---------- */
  /* options: { fill, tuck: false, ground: false, ratio, extra } */
  NS.init = function (scope, options) {
    scope = scope || doc;
    options = options || {};
    NS.analyzeGround(scope);
    each(scope.querySelectorAll('.si-nav'), function (nav) {
      var fit = function () { NS.fitNav(nav, options.fill); };
      fit();
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fit);
      var lastWidth = nav.clientWidth;
      var onWidth = function () { if (nav.clientWidth !== lastWidth) { lastWidth = nav.clientWidth; fit(); } };
      if (root.ResizeObserver) new root.ResizeObserver(onWidth).observe(nav); else root.addEventListener('resize', onWidth);
      if (options.tuck !== false && !nav.classList.contains('si-nav--static')) NS.tuckNav(nav, options);
      if (options.ground !== false) NS.watchGround(nav, options);
      NS.search(nav);
    });
    each(scope.querySelectorAll('.si-collage'), function (c) { NS.collage(c, options.collage); });
    NS.toggles(scope);
    return NS;
  };

  root.SupergraphicIndex = NS;
  if (typeof module === 'object' && module.exports) module.exports = NS;
})(typeof window !== 'undefined' ? window : globalThis);
