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
import { Text } from '../../worker-thread/Text';

test.beforeEach(t => {
  t.context = {
    node: new Node(NodeType.ELEMENT_NODE, 'div'),
    child: new Node(NodeType.ELEMENT_NODE, 'p'),
    nodeText: new Text('text in node'),
    childText: new Text(' text in child'),
  };
});

test('textContent getter returns empty string when there are no text childNodes.', t => {
  const { node } = t.context as { node: Node };

  t.is(node.textContent, '');
});

test('textContent getter returns the value of direct childNodes when there are no children', t => {
  const { node, nodeText } = t.context as { node: Node; nodeText: Text };

  node.appendChild(nodeText);
  t.is(node.textContent, nodeText.textContent);
  t.is(node.textContent, 'text in node');
});

test('textContent getter returns the value of all depths childNodes when there are children with no textContent', t => {
  const { node, child, nodeText } = t.context as { node: Node; child: Node; nodeText: Text };

  node.appendChild(nodeText);
  node.appendChild(child);
  t.is(node.textContent, nodeText.textContent);
  t.is(node.textContent, 'text in node');
});

test('textContent returns the value of all depths childNodes when there are children', t => {
  const { node, child, nodeText, childText } = t.context as { node: Node; child: Node; nodeText: Text; childText: Text };

  child.appendChild(childText);
  node.appendChild(nodeText);
  node.appendChild(child);
  t.is(node.textContent, nodeText.textContent + childText.textContent);
  t.is(node.textContent, 'text in node text in child');
});
