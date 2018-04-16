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
import { Node, NodeType } from '../../worker-thread/Node';

test.beforeEach(t => {
  t.context = {
    node: new Node(NodeType.ELEMENT_NODE, 'div'),
    child: new Node(NodeType.ELEMENT_NODE, 'div'),
    childTwo: new Node(NodeType.ELEMENT_NODE, 'div'),
  };
});

test('when a parent contains two children, the previous sibling of the second is the first', t => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(childTwo.previousSibling, child);
});

test('when a node does not have a parent, its previous sibling is null', t => {
  const { node } = t.context;

  t.is(node.previousSibling, null);
});

test('when a node is the first child of a parent, the previous sibling is null', t => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(child.previousSibling, null);
});
