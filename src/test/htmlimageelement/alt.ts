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

test.beforeEach(t => {
  t.context = {
    element: new HTMLImageElement(NodeType.ELEMENT_NODE, 'img', null),
  };
});

test('alt should be empty by default', t => {
  const { element } = t.context as { element: HTMLImageElement };

  t.is(element.alt, '');
});

test('alt should be settable to a string value', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.alt = 'A cat and dog cuddle with their favorite human';
  t.is(element.alt, 'A cat and dog cuddle with their favorite human');
});

test('alt property change should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.alt = 'A cat and dog cuddle with their favorite human';
  t.is(element.getAttribute('alt'), 'A cat and dog cuddle with their favorite human');
});

test('alt attribute change should be reflected in property', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.setAttribute('alt', 'A cat and dog cuddle with their favorite human');
  t.is(element.alt, 'A cat and dog cuddle with their favorite human');
});
