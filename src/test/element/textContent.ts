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
import { Text } from '../../worker-thread/Text';

test.beforeEach(t => {
  t.context = {
    element: new Element(NodeType.ELEMENT_NODE, 'div'),
    child: new Element(NodeType.ELEMENT_NODE, 'p'),
    text: new Text('default text'),
  };
});

test('textContent setter adds a child text node to Element.', t => {
  const { element } = t.context as { element: Element };

  t.is(element.childNodes.length, 0);
  element.textContent = 'foo';
  t.is(element.childNodes.length, 1);
});

test('textContent setter replaces childNodes with single text node.', t => {
  const { element, child, text } = t.context as { element: Element; child: Element; text: Text };

  child.appendChild(text);
  element.appendChild(child);
  t.deepEqual(element.childNodes, [child]);

  element.textContent = 'foo';
  t.is(element.childNodes.length, 1);
  t.is(element.childNodes[0].data, 'foo');
});
