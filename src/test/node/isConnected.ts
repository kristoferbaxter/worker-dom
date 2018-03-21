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
import { Node, NodeType } from '../../Node';

test.beforeEach(t => {
  t.context = {
    node: new Node(NodeType.ELEMENT_NODE, 'div'),
    child: new Node(NodeType.ELEMENT_NODE, 'div'),
  };
});

test('without a document, tree depth 1 nodes are not connected', t => {
  const { node } = t.context as { node: Node };

  t.is(node.isConnected, false);
});

test('without a document, tree depth > 1 are not connected', t => {
  const { node, child } = t.context as { node: Node; child: Node };

  node.appendChild(child);

  t.is(node.isConnected, false);
  t.is(child.isConnected, false);
});

// TODO(KB): Add a document body test when Docment becomes available.
