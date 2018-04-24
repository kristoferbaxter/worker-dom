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
import { MutationObserver } from './MutationObserver';
import { observe as observeMutations } from '../transfer/DocumentMutations';
import { propagate as propagateEvents } from '../transfer/TransferableEvent';

type createElementFunc = (type: string) => Element;
type createElementNSFunc = (type: string, namespace: string) => Element;
type createTextNodeFunc = (text: string) => Text;

export class Document extends Element {
  public defaultView: {
    document: Document;
    MutationObserver: typeof MutationObserver;
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
      MutationObserver: MutationObserver,
      Document: Document,
      Node: Node,
      Text: Text,
      Element: Element,
      SVGElement: SVGElement,
      Event: Event,
    };
  }
}

export const document = (function() {
  function createElement(tagName: string): Element {
    return new Element(NodeType.ELEMENT_NODE, String(tagName).toUpperCase());
  }

  function createElementNS(namespaceURI: string, tagName: string): Element {
    let element = createElement(tagName);
    element.namespace = namespaceURI;
    return element;
  }

  function createDocument(): Document {
    let document = new Document(createElement, createElementNS, (text: string): Text => new Text(text));
    document.isConnected = true;
    document.appendChild((document.body = createElement('body')));
    observeMutations(document);
    propagateEvents();

    return document;
  }

  return createDocument();
})();
