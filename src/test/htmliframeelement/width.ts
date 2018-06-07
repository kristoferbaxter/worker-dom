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
import { HTMLIFrameElement } from '../../worker-thread/dom/HTMLIFrameElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLIFrameElement(NodeType.ELEMENT_NODE, 'iframe', null),
  };
});

test('width should be empty by default', t => {
  const { element } = t.context as { element: HTMLIFrameElement };

  t.is(element.width, '');
});

test('width should be settable to a string value', t => {
  const { element } = t.context as { element: HTMLIFrameElement };

  element.width = '50px';
  t.is(element.width, '50px');
});

test('width property change should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLIFrameElement };

  element.width = '50px';
  t.is(element.getAttribute('width'), '50px');
});

test('width attribute change should be reflected in property', t => {
  const { element } = t.context as { element: HTMLIFrameElement };

  element.setAttribute('width', '50px');
  t.is(element.width, '50px');
});
