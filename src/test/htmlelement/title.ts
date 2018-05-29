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
import { HTMLElement } from '../../worker-thread/HTMLElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLElement(NodeType.ELEMENT_NODE, 'div', null),
  };
});

test('title should be empty by default', t => {
  const { element } = t.context as { element: HTMLElement };

  t.is(element.title, '');
});

test('title should be settable to a single value', t => {
  const { element } = t.context as { element: HTMLElement };

  element.title = 'interesting div htmlelement-ish';
  t.is(element.title, 'interesting div htmlelement-ish');
});

test('title should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLElement };

  element.title = 'interesting div htmlelement-ish';
  t.is(element.getAttribute('title'), 'interesting div htmlelement-ish');
});

test('title should be reflected in property', t => {
  const { element } = t.context as { element: HTMLElement };

  element.setAttribute('title', 'interesting div htmlelement-ish');
  t.is(element.title, 'interesting div htmlelement-ish');
});
