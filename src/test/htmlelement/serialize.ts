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
import { Element } from '../../worker-thread/dom/Element';
import { NodeType } from '../../worker-thread/dom/Node';
import { TransferableNode } from '../../transfer/TransferableNodes';

const RANDOM_TEXT_CONTENT = `TEXT_CONTENT-${Math.random()}`;
const DIV_ID = 'DIV_ID';
const DIV_CLASS = 'DIV_CLASS';

test.beforeEach(t => {
  const div = new Element(NodeType.ELEMENT_NODE, 'div', null);
  div.setAttribute('id', DIV_ID);
  div.setAttribute('class', DIV_CLASS);
  div.textContent = RANDOM_TEXT_CONTENT;
  t.context = {
    div,
  };
});

test('Element should serialize to a TransferableNode', t => {
  const serializedDiv = t.context.div._serialize_();
  t.is(serializedDiv.nodeType, NodeType.ELEMENT_NODE);
  t.is(serializedDiv.nodeName, 'div');
  t.is(serializedDiv.childNodes.length, 1);
  t.is(serializedDiv.attributes.length, 2);
  t.is(serializedDiv.attributes[0].name, 'id');
  t.is(serializedDiv.attributes[0].value, DIV_ID);
  t.is(serializedDiv.attributes[1].name, 'class');
  t.is(serializedDiv.attributes[1].value, DIV_CLASS);
  t.is(serializedDiv.childNodes[0].textContent, RANDOM_TEXT_CONTENT);
  // Properties are not yet implemented
  t.is(serializedDiv.properties.length, 0);
});

test('Element should serialize namespace', t => {
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const svg = new Element(NodeType.ELEMENT_NODE, 'svg', SVG_NAMESPACE);
  t.is((svg._serialize_() as TransferableNode).namespace, SVG_NAMESPACE);
});

test('Element should serialize child node as well', t => {
  const div = new Element(NodeType.ELEMENT_NODE, 'div', null);
  const childDiv = new Element(NodeType.ELEMENT_NODE, 'div', null);
  div.appendChild(childDiv);
  const serializedDiv = div._serialize_() as TransferableNode;
  t.is(serializedDiv.childNodes.length, 1);
  t.deepEqual(serializedDiv.childNodes[0], childDiv._serialize_());
});
