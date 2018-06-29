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
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLFieldSetElement } from '../../worker-thread/dom/HTMLFieldSetElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLFieldSetElement(NodeType.ELEMENT_NODE, 'fieldset', null),
  };
});

test('disabled should be false by default', t => {
  const { element } = t.context as { element: HTMLFieldSetElement };

  t.is(element.disabled, false);
});

test('disabled should be settable to a true', t => {
  const { element } = t.context as { element: HTMLFieldSetElement };

  element.disabled = true;
  t.is(element.disabled, true);
});

test('disabled should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLFieldSetElement };

  element.disabled = true;
  t.is(element.getAttribute('disabled'), 'true');
  element.disabled = false;
  t.is(element.getAttribute('disabled'), 'false');
});

test('disabled should be reflected in property', t => {
  const { element } = t.context as { element: HTMLFieldSetElement };

  element.setAttribute('disabled', 'true');
  t.is(element.disabled, true);
});
