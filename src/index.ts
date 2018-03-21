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

import { NodeType } from './Node';
import { Element } from './Element';
import { Text } from './Text';
import { Document } from './Document';

// export { Node, Element, Text, Event };

export function dom() {
  function createElement(tagName: string): Element {
    return new Element(NodeType.ELEMENT_NODE, String(tagName).toUpperCase());
  }

  function createElementNS(ns: string, tagName: string): Element {
    let element = createElement(tagName);
    element.namespace = ns;
    return element;
  }

  function createDocument(): Document {
    let document = new Document(createElement, createElementNS, (text: string): Text => new Text(text));
    document.isConnected = true;
    document.appendChild((document.body = createElement('body')));
    return document;
  }

  return createDocument();
}
