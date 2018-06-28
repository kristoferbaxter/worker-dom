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
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';
import { Element } from '../../worker-thread/dom/Element';

test.beforeEach(t => {
  const document = new Element(NodeType.DOCUMENT_NODE, '#document', null, null);
  t.context = {
    element: new HTMLElement(NodeType.ELEMENT_NODE, 'div', null, document),
  };
});

test('draggable should be false by default', t => {
  const { element } = t.context as { element: HTMLElement };

  t.is(element.draggable, false);
});

test('draggable should be settable to a single value', t => {
  const { element } = t.context as { element: HTMLElement };

  element.draggable = true;
  t.is(element.draggable, true);
});

test('draggable property change should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLElement };

  element.draggable = true;
  t.is(element.getAttribute('draggable'), 'true');
});

test('draggable attribute change should be reflected in property', t => {
  const { element } = t.context as { element: HTMLElement };

  element.setAttribute('draggable', 'true');
  t.is(element.draggable, true);
});
