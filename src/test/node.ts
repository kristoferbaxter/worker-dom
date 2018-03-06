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
import { Node, NodeType } from '../Node';
import { Event } from '../Event';

test('Node.nodeName returns the name of the Node', t => {
  t.plan(2);

  const node = new Node(NodeType.TEXT_NODE, '#text');
  const nodeTwo = new Node(NodeType.ELEMENT_NODE, 'div');

  t.is(node.nodeName, '#text', 'text node returns a valid text node name');
  t.is(nodeTwo.nodeName, 'div', 'standard element node returns a valid node name');
});

test('Node.dispatchEvent() calls handler functions registered with addEventListener', t => {
  t.plan(3);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  node.addEventListener('click', (event: Event) => {
    t.deepEqual(event.target, node, 'event target is the node the event was dispatched from');
    t.pass();
  });

  const event = new Event('click', {});
  event.target = node;
  t.true(node.dispatchEvent(event));
});

test('Node.dispatchEvent() does not call handler functions removed with removeEventListener', t => {
  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const functionRemoved = (event: Event) => t.fail('removeEventListener function handler was called');
  node.addEventListener('click', functionRemoved);
  node.removeEventListener('click', functionRemoved);

  const event = new Event('click', {});
  event.target = node;
  t.true(node.dispatchEvent(event));
});

test('Node.dispatchEvent() calls handler functions for only specified type of event', t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  node.addEventListener('click', (event: Event) => {
    t.is(event.type, 'click', 'event type is correct');
  });
  node.addEventListener('foo', (event: Event) => {
    t.fail('handler for the incorrect type was called');
  });

  const event = new Event('click', {});
  event.target = node;
  t.true(node.dispatchEvent(event));
});

test('Node.appendChild() adds specified child Node', t => {
  t.plan(4);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const child = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(child);
  t.deepEqual(node.childNodes[0], child, 'appending to an empty childNode[] makes childNode[0] = new child');

  const childTwo = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(childTwo);
  t.deepEqual(node.childNodes[1], childTwo, 'appending to a populated childNode[] makes childNode[length] = new child');

  const childThree = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(childThree);
  node.appendChild(child);
  t.deepEqual(node.childNodes[0], childTwo, 'reappending a known child removes the child from exising position');
  t.deepEqual(node.childNodes[2], child, 'reappending a known child makes childNode[length] = new child');
});

test('Node.removeChild() removes specified child Node from parent', t => {
  t.plan(3);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const child = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(child);
  node.removeChild(child);
  t.is(node.childNodes.length, 0, 'removing the only child from childNode[] makes childNodes have no members');

  const childTwo = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(child);
  node.appendChild(childTwo);
  node.removeChild(childTwo);
  t.is(node.childNodes.length, 1, 'removing a child from childNode[] makes childNodes have the correct length');
  t.deepEqual(node.childNodes[0], child, 'removing a child from childNodes[] does not remove other children');
});

test('Node.remove() removes Node from parent', t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const child = new Node(NodeType.ELEMENT_NODE, 'div');

  node.appendChild(child);
  child.remove();
  t.is(node.childNodes.length, 0, 'removing a node from a known parent reduces Parent.childNodes[].length by 1.');

  node.remove();
  t.pass('removing a node without a parent does not error');
});

test('Node.contains(node) returns if node is contained within Node', t => {
  t.plan(5);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  t.is(node.contains(node), true, 'a node contains itself, return true');

  const child = new Node(NodeType.ELEMENT_NODE, 'div');
  t.is(node.contains(child), false, 'for a node not contained by parent, return false');

  node.appendChild(child);
  t.is(node.contains(child), true, 'for a node contained directly by parent, return true');

  const deeperChild = new Node(NodeType.TEXT_NODE, '#text');
  child.appendChild(deeperChild);
  t.is(node.contains(deeperChild), true, 'for a node contained deeper within a tree, return true');

  t.is(deeperChild.contains(node), false, 'for a node deep within a tree ensure it does not contain parents, return false');
});

test('Node.insertBefore(child, ref) inserts child before reference node', t => {
  t.plan(6);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const child = new Node(NodeType.ELEMENT_NODE, 'div');
  const childTwo = new Node(NodeType.ELEMENT_NODE, 'div');
  t.is(node.insertBefore(child, undefined), null, 'attempting to insert before an undefined reference returns null');
  t.is(node.insertBefore(child, childTwo), null, 'attempting to insert before a node which is not a direct child returns null');

  const inserted: Node = node.insertBefore(child, null) as Node;
  t.deepEqual(node.childNodes[node.childNodes.length - 1], inserted, 'inserting with a null reference appends the child');
  node.insertBefore(inserted, child);
  t.is(node.childNodes.indexOf(inserted), node.childNodes.indexOf(child), 'attempting to insert a node before itself does not move the node');

  node.insertBefore(childTwo, child);
  t.is(node.childNodes.indexOf(childTwo), 0, 'inserting a child before the only child in a node will make it first in Node.childNodes');

  const childThree = new Node(NodeType.ELEMENT_NODE, 'div');
  node.insertBefore(childThree, child);
  t.is(node.childNodes.indexOf(childThree), node.childNodes.indexOf(child) - 1, 'inserting a child before another when there are multiple children places it before the ref');
});

test('Node.firstChild returns Node.childNodes[0]', t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const child = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(child);
  t.deepEqual(node.firstChild, child, 'a single child is returned when only a single child is available.');

  const childTwo = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(childTwo);
  t.deepEqual(node.firstChild, child, 'the first child added is returned when more than a single child is available.');
});

test('Node.lastChild returns Node.childNodes[last]', t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const child = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(child);
  t.deepEqual(node.lastChild, child, 'a single child is returned when only a single child is available.');

  const childTwo = new Node(NodeType.ELEMENT_NODE, 'div');
  node.appendChild(childTwo);
  t.deepEqual(node.lastChild, childTwo, 'the last child added is returned when more than a single child is available.');
});

test('Node.nextSibling returns the next sibling node', t => {
  t.plan(3);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const child = new Node(NodeType.ELEMENT_NODE, 'div');
  const childTwo = new Node(NodeType.ELEMENT_NODE, 'div');

  node.appendChild(child);
  node.appendChild(childTwo);

  t.deepEqual(child.nextSibling, childTwo, 'when a parent contains two children, the next sibling of the first is the second.');
  t.is(node.nextSibling, null, 'when a node does not have a parent, its next sibling is null');
  t.is(childTwo.nextSibling, null, 'when a node is the last child of a parent, the next sibling is null');
});

test('Node.previousSibling returns the previous sibling node', t => {
  t.plan(3);

  const node = new Node(NodeType.ELEMENT_NODE, 'div');
  const child = new Node(NodeType.ELEMENT_NODE, 'div');
  const childTwo = new Node(NodeType.ELEMENT_NODE, 'div');

  node.appendChild(child);
  node.appendChild(childTwo);

  t.deepEqual(childTwo.previousSibling, child, 'when a parent contains two children, the previous sibling of the second is the first.');
  t.is(node.previousSibling, null, 'when a node does not have a parent, its previous sibling is null');
  t.is(child.previousSibling, null, 'when a node is the first child of a parent, the previous sibling is null');
});
