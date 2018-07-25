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
import { Element } from '../../worker-thread/dom/Element';

type Context = {
  node: Element;
};

test.beforeEach(t => {
  const context: Context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', null),
  };

  t.context = context;
});

test('hasAttribute is false by default', t => {
  const { node } = t.context as Context;

  t.is(node.hasAttribute('class'), false);
});

test('hasAttribute is true, when attribute is added', t => {
  const { node } = t.context as Context;

  node.setAttribute('data-foo', 'bar');
  t.is(node.hasAttribute('data-foo'), true);
});

test('hasAttribute is true, when empty className is added', t => {
  const { node } = t.context as Context;

  node.className = '';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true, when valid className is added', t => {
  const { node } = t.context as Context;

  node.className = 'foo';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true, when DOMTokenList is set to empty string', t => {
  const { node } = t.context as Context;

  node.classList.value = '';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true when last value is removed from DOMTokenList driven attribute', t => {
  const { node } = t.context as Context;

  node.classList.value = 'foo';
  node.classList.toggle('foo');
  t.is(node.hasAttribute('class'), true);
});
