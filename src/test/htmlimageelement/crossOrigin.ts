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
import { HTMLImageElement } from '../../worker-thread/dom/HTMLImageElement';
import { Element } from '../../worker-thread/dom/Element';

test.beforeEach(t => {
  const document = new Element(NodeType.DOCUMENT_NODE, '#document', null, null);
  t.context = {
    element: new HTMLImageElement(NodeType.ELEMENT_NODE, 'img', null, document),
  };
});

test('crossOrigin should be empty by default', t => {
  const { element } = t.context as { element: HTMLImageElement };

  t.is(element.crossOrigin, '');
});

test('crossOrigin should be settable to a string value', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.crossOrigin = 'use-credentials';
  t.is(element.crossOrigin, 'use-credentials');
});

test('crossOrigin property change should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.crossOrigin = 'use-credentials';
  t.is(element.getAttribute('crossorigin'), 'use-credentials');
});

test('crossOrigin attribute change should be reflected in property', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.setAttribute('crossorigin', 'use-credentials');
  t.is(element.crossOrigin, 'use-credentials');
});
