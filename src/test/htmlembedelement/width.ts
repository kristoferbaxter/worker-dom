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
import { HTMLEmbedElement } from '../../worker-thread/dom/HTMLEmbedElement';
import { Element } from '../../worker-thread/dom/Element';

test.beforeEach(t => {
  const document = new Element(NodeType.DOCUMENT_NODE, '#document', null, null);
  t.context = {
    element: new HTMLEmbedElement(NodeType.ELEMENT_NODE, 'embed', null, document),
  };
});

test('width should be empty by default', t => {
  const { element } = t.context as { element: HTMLEmbedElement };

  t.is(element.width, '');
});

test('width should be settable to a single value', t => {
  const { element } = t.context as { element: HTMLEmbedElement };

  element.width = '640';
  t.is(element.width, '640');
});

test('width property change should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLEmbedElement };

  element.width = '640';
  t.is(element.getAttribute('width'), '640');
});

test('width attribute change should be reflected in property', t => {
  const { element } = t.context as { element: HTMLEmbedElement };

  element.setAttribute('width', '640');
  t.is(element.width, '640');
});
