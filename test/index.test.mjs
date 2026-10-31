import { beforeEach, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { setup, key } from './helpers.mjs';
import { RovingFocus } from '../dist/index.js';
let ui;
beforeEach(async () => (ui = await setup()));
afterEach(async () => ui.cleanup());
test('one tab stop, disabled skipping and RTL arrows', async () => {
  await ui.render(
    createElement(
      RovingFocus,
      { ids: ['a', 'b', 'c'], disabledIds: ['b'], orientation: 'horizontal', direction: 'rtl' },
      (group) =>
        ['a', 'b', 'c'].map((id) =>
          createElement('button', { key: id, ...group.getItemProps(id) }, id),
        ),
    ),
  );
  const buttons = ui.container.querySelectorAll('button');
  assert.equal(buttons[0].tabIndex, 0);
  await key(buttons[0], 'ArrowLeft');
  assert.equal(document.activeElement, buttons[2]);
  assert.equal(buttons[2].tabIndex, 0);
  assert.equal(buttons[0].tabIndex, -1);
});
