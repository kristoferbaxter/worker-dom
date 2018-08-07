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
import { NodeType } from '../../src/dom/Node';
import { HTMLElement } from '../../src/dom/HTMLElement';
import { HTMLAnchorElement } from '../../src/dom/HTMLAnchorElement';
import { Text } from '../../src/dom/Text';

test.beforeEach(t => {
  t.context = {
    element: new HTMLAnchorElement(NodeType.ELEMENT_NODE, 'a', null),
    child: new HTMLElement(NodeType.ELEMENT_NODE, 'p', null),
    text: new Text('default text'),
  };
});

test('text setter adds a child text node to HTMLAnchorElement.', t => {
  const { element } = t.context as { element: HTMLAnchorElement };

  t.is(element.childNodes.length, 0);
  element.text = 'foo';
  t.is(element.childNodes.length, 1);
});

test('clearing text via setter removes value stored as text inside element', t => {
  const { element, text } = t.context as { element: HTMLAnchorElement; text: Text };

  element.appendChild(text);
  t.is(element.childNodes[0].data, 'default text');

  element.text = '';
  t.is(element.childNodes[0].data, '');
});

test('text setter replaces childNodes with single text node.', t => {
  const { element, child, text } = t.context as { element: HTMLAnchorElement; child: HTMLElement; text: Text };

  child.appendChild(text);
  element.appendChild(child);
  t.deepEqual(element.childNodes, [child]);
  t.is(element.childNodes[0].childNodes[0].data, 'default text');

  element.text = 'foo';
  t.is(element.childNodes.length, 1);
  t.is(element.childNodes[0].data, 'foo');
});
