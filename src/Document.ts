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

import { Element } from './Element';
import { SVGElement } from './Element';
import { Node, NodeType } from './Node';
import { Event } from './Event';
import { Text } from './Text';

type createElementFunc = (type: string) => Element;
type createElementNSFunc = (type: string, namespace: string) => Element;
type createTextNodeFunc = (text: string) => Text;

export class Document extends Element {
  public defaultView: {
    document: Document;
    // TODO(KB): Restore mutation observation
    // MutationObserver: typeof MutationObserver;
    Document: typeof Document;
    Node: typeof Node;
    Text: typeof Text;
    Element: typeof Element;
    SVGElement: typeof SVGElement;
    Event: typeof Event;
  };
  public documentElement: Document;
  public createElement: createElementFunc;
  public createElementNS: createElementNSFunc;
  public createTextNode: createTextNodeFunc;
  public body: Element;

  constructor(createElement: createElementFunc, createElementNS: createElementNSFunc, createTextNode: createTextNodeFunc) {
    super(NodeType.DOCUMENT_NODE, '#document');
    this.documentElement = this;
    this.createElement = createElement;
    this.createElementNS = createElementNS;
    this.createTextNode = createTextNode;
    this.defaultView = {
      document: this,
      // TODO(KB): Restore mutation observation
      // MutationObserver: MutationObserver,
      Document: Document,
      Node: Node,
      Text: Text,
      Element: Element,
      SVGElement: SVGElement,
      Event: Event,
    };
  }
}
