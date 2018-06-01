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
import { HTMLEmbedElement } from '../../worker-thread/HTMLEmbedElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLEmbedElement(NodeType.ELEMENT_NODE, 'embed', null),
  };
});

test('height should be empty by default', t => {
  const { element } = t.context as { element: HTMLEmbedElement };

  t.is(element.height, '');
});

test('height should be settable to a single value', t => {
  const { element } = t.context as { element: HTMLEmbedElement };

  element.height = '480';
  t.is(element.height, '480');
});

test('height should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLEmbedElement };

  element.height = '480';
  t.is(element.getAttribute('height'), '480');
});

test('height should be reflected in property', t => {
  const { element } = t.context as { element: HTMLEmbedElement };

  element.setAttribute('height', '480');
  t.is(element.height, '480');
});
