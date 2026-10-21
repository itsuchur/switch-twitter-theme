const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const source = readFileSync(`${__dirname}/main.js`, 'utf8');

function load({ cookies = '', dark = false, blocked = false, hostname = 'x.com' } = {}) {
  const jar = new Map(cookies.split(';').filter(Boolean).map(cookie => {
    const [name, ...value] = cookie.trim().split('=');
    return [name, value.join('=')];
  }));
  const writes = [];
  let reloads = 0;
  let onChange;
  const media = {
    matches: dark,
    addEventListener(event, callback) {
      assert.equal(event, 'change');
      onChange = callback;
    },
  };
  runInNewContext(source, {
    document: {
      get cookie() { return [...jar].map(entry => entry.join('=')).join(';'); },
      set cookie(value) {
        writes.push(value);
        if (!blocked) {
          const [name, content] = value.split(';')[0].split('=');
          jar.set(name, content);
        }
      },
    },
    window: {
      matchMedia(query) {
        assert.equal(query, '(prefers-color-scheme: dark)');
        return media;
      },
      location: { hostname, reload() { reloads++; } },
    },
  });
  return {
    jar, writes,
    get reloads() { return reloads; },
    change(dark) { media.matches = dark; onChange(); },
  };
}

test('creates missing cookies with site-wide scope on both hosts', () => {
  for (const hostname of ['twitter.com', 'x.com']) {
    for (const dark of [false, true]) {
      const page = load({ dark, hostname });
      assert.equal(page.jar.get('night_mode'), dark ? '1' : '0');
      assert.equal(page.writes[0], `night_mode=${dark ? '1' : '0'}; Domain=${hostname}; Path=/; SameSite=Lax`);
      assert.equal(page.reloads, 1);
    }
  }
});

test('matches exact cookie names without requiring separator whitespace', () => {
  const page = load({ cookies: 'night_mode_extra=keep;night_mode=0;other=value', dark: true });
  assert.equal(page.jar.get('night_mode'), '1');
  assert.equal(page.jar.get('night_mode_extra'), 'keep');
  assert.equal(page.jar.get('other'), 'value');
});

test('does not write or refresh when the theme already matches', () => {
  const page = load({ cookies: 'night_mode=1', dark: true });
  page.change(true);
  assert.equal(page.writes.length, 0);
  assert.equal(page.reloads, 0);
});

test('tracks changes in both directions and avoids duplicate refreshes', () => {
  const page = load({ cookies: 'night_mode=0' });
  page.change(true);
  assert.equal(page.jar.get('night_mode'), '1');
  page.change(true);
  assert.equal(page.reloads, 1);
  page.change(false);
  assert.equal(page.jar.get('night_mode'), '0');
  assert.equal(page.reloads, 2);
});

test('does not reload again on the next page load', () => {
  const first = load({ dark: true });
  const second = load({ cookies: `night_mode=${first.jar.get('night_mode')}`, dark: true });
  assert.equal(second.reloads, 0);
});

test('blocked cookie writes do not trigger reload loops', () => {
  const page = load({ cookies: 'night_mode=0', dark: true, blocked: true });
  page.change(true);
  assert.equal(page.reloads, 0);
  assert.equal(page.jar.get('night_mode'), '0');
});

test('manifest loads the content script at startup on both hosts', () => {
  const manifest = JSON.parse(readFileSync(`${__dirname}/manifest.json`, 'utf8'));
  assert.ok(manifest.content_scripts.some(script =>
    script.run_at === 'document_start' && script.js.includes('main.js') &&
    ['*://twitter.com/*', '*://x.com/*'].every(host => script.matches.includes(host))));
});
