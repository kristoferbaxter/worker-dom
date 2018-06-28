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
import { Node, NodeType } from '../../worker-thread/dom/Node';

test.beforeEach(t => {
  const document = new Node(NodeType.DOCUMENT_NODE, '#document', null);
  t.context = {
    node: new Node(NodeType.ELEMENT_NODE, 'div', document),
    child: new Node(NodeType.ELEMENT_NODE, 'div', document),
    childTwo: new Node(NodeType.ELEMENT_NODE, 'div', document),
  };
});

test('when a parent contains two children, the next sibling of the first is the second', t => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(child.nextSibling, childTwo);
});

test('when a node does not have a parent, its next sibling is null', t => {
  const { node } = t.context;

  t.is(node.nextSibling, null);
});

test('when a node is the last child of a parent, the next sibling is null', t => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.is(childTwo.nextSibling, null);
});
