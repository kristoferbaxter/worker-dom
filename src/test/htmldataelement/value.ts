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
import { HTMLDataElement } from '../../worker-thread/dom/HTMLDataElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLDataElement(NodeType.ELEMENT_NODE, 'data', null),
  };
});

test('value should be empty by default', t => {
  const { element } = t.context as { element: HTMLDataElement };

  t.is(element.value, '');
});

test('value should be settable to a single value', t => {
  const { element } = t.context as { element: HTMLDataElement };

  element.value = 'yay';
  t.is(element.value, 'yay');
});

test('value property change should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLDataElement };

  element.value = 'yay';
  t.is(element.getAttribute('value'), 'yay');
});

test('value attribute change should be reflected in property', t => {
  const { element } = t.context as { element: HTMLDataElement };

  element.setAttribute('value', 'yay');
  t.is(element.value, 'yay');
});
