/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import test from 'ava';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { document } from '../../worker-thread/dom/Document';

test.beforeEach(t => {
  t.context = {
    option: document.createElement('option'),
  };
});
test.afterEach(t => {
  document.body.childNodes.forEach(childNode => childNode.remove());
});

test('defaultSelected should be false by default', t => {
  const { option } = t.context as { option: HTMLOptionElement };

  t.is(option.defaultSelected, false);
});

test('defaultSelected should be settable to true', t => {
  const { option } = t.context as { option: HTMLOptionElement };

  option.defaultSelected = true;
  t.is(option.defaultSelected, true);
});

test('defaultSelected should be reflected in attribute', t => {
  const { option } = t.context as { option: HTMLOptionElement };

  option.defaultSelected = true;
  t.is(option.getAttribute('selected'), 'true');
  option.defaultSelected = false;
  t.is(option.getAttribute('selected'), 'false');
});

test('defaultSelected should be reflected in property', t => {
  const { option } = t.context as { option: HTMLOptionElement };

  option.setAttribute('selected', 'true');
  t.is(option.defaultSelected, true);
});
