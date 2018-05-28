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
import { NodeType } from '../../worker-thread/Node';
import { Element } from '../../worker-thread/Element';
import '../../worker-thread/HTMLElement';

test.beforeEach(t => {
  t.context = {
    element: new Element(NodeType.ELEMENT_NODE, 'div', null),
  };
});

test('accessKey should be empty by default', t => {
  const { element } = t.context as { element: Element };

  t.is(element.accessKey, '');
});

test('accessKey should be settable to a single value', t => {
  const { element } = t.context as { element: Element };

  element.accessKey = 'f';
  t.is(element.accessKey, 'f');
});

test('accessKey should be reflected in attribute', t => {
  const { element } = t.context as { element: Element };

  element.accessKey = 'f';
  t.is(element.getAttribute('accesskey'), 'f');
});

test('accessKey should be reflected in property', t => {
  const { element } = t.context as { element: Element };

  element.setAttribute('accesskey', 'b');
  t.is(element.accessKey, 'b');
});
