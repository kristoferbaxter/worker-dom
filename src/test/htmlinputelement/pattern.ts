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
import { HTMLInputElement } from '../../worker-thread/dom/HTMLInputElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLInputElement(NodeType.ELEMENT_NODE, 'input', null),
  };
});

test('pattern should be empty by default', t => {
  const { element } = t.context as { element: HTMLInputElement };

  t.is(element.pattern, '');
});

test('pattern should be settable to a string value', t => {
  const { element } = t.context as { element: HTMLInputElement };

  element.pattern = '[a-z]{1,15}';
  t.is(element.pattern, '[a-z]{1,15}');
});

test('pattern property change should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLInputElement };

  element.pattern = '[a-z]{1,15}';
  t.is(element.getAttribute('pattern'), '[a-z]{1,15}');
});

test('pattern attribute change should be reflected in property', t => {
  const { element } = t.context as { element: HTMLInputElement };

  element.setAttribute('pattern', '[a-z]{1,15}');
  t.is(element.pattern, '[a-z]{1,15}');
});