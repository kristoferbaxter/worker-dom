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

import test from "ava";
import { Node, NodeType } from "../Node";
import { Event } from "../Event";

test("Node.dispatchEvent() calls handler functions registered with addEventListener", t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE);
  node.addEventListener("click", (event: Event) => {
    t.pass();
  });

  const event = new Event("click", {});
  event.target = t.context.node;
  t.true(node.dispatchEvent(event));
});

test("Node.dispatchEvent() does not call handler functions removed with removeEventListener", t => {
  const node = new Node(NodeType.ELEMENT_NODE);
  const functionRemoved = (event: Event) => t.fail("removeEventListener function handler was called");
  node.addEventListener("click", functionRemoved);
  node.removeEventListener("click", functionRemoved);

  const event = new Event("click", {});
  event.target = node;
  t.true(node.dispatchEvent(event));
});

test("Node.dispatchEvent() calls handler functions for only specified type of event", t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE);
  node.addEventListener("click", (event: Event) => {
    t.is(event.type, "click", "event type is correct");
  });
  node.addEventListener("foo", (event: Event) => {
    t.fail("handler for the incorrect type was called");
  });

  const event = new Event("click", {});
  event.target = node;
  t.true(node.dispatchEvent(event));
});

test("Node.dispatchEvent() does not call handler functions for unspecified event types", t => {
  const node = new Node(NodeType.ELEMENT_NODE);
  node.addEventListener("foo", (event: Event) => {
    t.fail("handler for the incorrect type was called");
  });

  const event = new Event("click", {});
  event.target = node;
  t.true(node.dispatchEvent(event));
});

test("Node.dispatchEvent() calls handler functions with correct event.target", t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE);
  node.addEventListener("click", (event: Event) => {
    t.deepEqual(event.target, node, "event target is the node the event was dispatched from");
  });

  const event: Event = new Event("click", {});
  event.target = node;
  t.true(node.dispatchEvent(event));
});

test("Node.appendChild() adds specified child Node", t => {
  t.plan(4);

  const node = new Node(NodeType.ELEMENT_NODE);
  const child = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(child);
  t.deepEqual(node.childNodes[0], child, "appending to an empty childNode[] makes childNode[0] = new child");

  const childTwo = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(childTwo);
  t.deepEqual(node.childNodes[1], childTwo, "appending to a populated childNode[] makes childNode[length] = new child");

  const childThree = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(childThree);
  node.appendChild(child);
  t.deepEqual(node.childNodes[0], childTwo, "reappending a known child removes the child from exising position");
  t.deepEqual(node.childNodes[2], child, "reappending a known child makes childNode[length] = new child");
});

test("Node.removeChild() removes specified child Node from parent", t => {
  t.plan(3);

  const node = new Node(NodeType.ELEMENT_NODE);
  const child = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(child);
  node.removeChild(child);
  t.is(node.childNodes.length, 0, "removing the only child from childNode[] makes childNodes have no members");

  const childTwo = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(child);
  node.appendChild(childTwo);
  node.removeChild(childTwo);
  t.is(node.childNodes.length, 1, "removing a child from childNode[] makes childNodes have the correct length");
  t.deepEqual(node.childNodes[0], child, "removing a child from childNodes[] does not remove other children");
});

test("Node.remove() removes Node from parent", t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE);
  const child = new Node(NodeType.ELEMENT_NODE);

  node.appendChild(child);
  child.remove();
  t.is(node.childNodes.length, 0, "removing a node from a known parent reduces Parent.childNodes[].length by 1.");

  node.remove();
  t.pass("removing a node without a parent does not error");
});

test("Node.firstChild returns Node.childNodes[0]", t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE);
  const child = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(child);
  t.deepEqual(node.firstChild, child, "a single child is returned when only a single child is available.");

  const childTwo = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(childTwo);
  t.deepEqual(node.firstChild, child, "the first child added is returned when more than a single child is available.");
});

test("Node.lastChild returns Node.childNodes[last]", t => {
  t.plan(2);

  const node = new Node(NodeType.ELEMENT_NODE);
  const child = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(child);
  t.deepEqual(node.lastChild, child, "a single child is returned when only a single child is available.");

  const childTwo = new Node(NodeType.ELEMENT_NODE);
  node.appendChild(childTwo);
  t.deepEqual(node.lastChild, childTwo, "the last child added is returned when more than a single child is available.");
});
