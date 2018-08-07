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

import { RenderableElement } from './RenderableElement';
import { NumericBoolean } from '@ampproject/worker-dom-transport/NumericBoolean';
import { TransferrableNode, TransferrableText, TransferrableElement } from '@ampproject/worker-dom-transport/TransferrableNodes';
import { TransferrableKeys } from '@ampproject/worker-dom-transport/TransferrableKeys';

let NODES: Map<number, RenderableElement>;
let BASE_ELEMENT: HTMLElement;

export function prepare(baseElement: Element): void {
  NODES = new Map([[1, baseElement as RenderableElement], [2, baseElement as RenderableElement]]);
  BASE_ELEMENT = baseElement as HTMLElement;
}

/**
 * Create a real DOM Node from a skeleton Object (`{ nodeType, nodeName, attributes, children, data }`)
 * @example <caption>Text node</caption>
 *   createNode({ nodeType:3, data:'foo' })
 * @example <caption>Element node</caption>
 *   createNode({ nodeType:1, nodeName:'div', attributes:[{ name:'a', value:'b' }], childNodes:[ ... ] })
 */
export function createNode(skeleton: TransferrableNode): RenderableElement {
  if (skeleton[TransferrableKeys.nodeType] === Node.TEXT_NODE) {
    const node = document.createTextNode((skeleton as TransferrableText)[TransferrableKeys.textContent]);
    storeNode(node, skeleton[TransferrableKeys._index_]);
    return node as RenderableElement;
  }

  const namespace: string | undefined = (skeleton as TransferrableElement)[TransferrableKeys.namespaceURI];
  const node: HTMLElement | SVGElement = namespace
    ? (document.createElementNS(namespace, (skeleton as TransferrableElement)[TransferrableKeys.nodeName]) as SVGElement)
    : document.createElement(skeleton[TransferrableKeys.nodeName]);
  ((skeleton as TransferrableElement)[TransferrableKeys.attributes] || []).forEach(attribute => {
    if (attribute.namespaceURI) {
      node.setAttributeNS(attribute.namespaceURI, attribute.name, attribute.value);
    } else {
      node.setAttribute(attribute.name, attribute.value);
    }
  });
  // TODO(KB): Restore Properties
  // skeleton.properties.forEach(property => {
  //   node[`${property.name}`] = property.value;
  // });
  ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).forEach(childNode => {
    if (childNode[TransferrableKeys.transferred] === NumericBoolean.FALSE) {
      node.appendChild(createNode(childNode as TransferrableNode));
    }
  });

  storeNode(node, skeleton[TransferrableKeys._index_]);
  return node as RenderableElement;
}

/**
 * Returns the real DOM Element corresponding to a serialized Element object.
 * @param id
 * @return
 */
export function getNode(id: number): RenderableElement {
  const node = NODES.get(id);

  if (node && node.nodeName === 'BODY') {
    // If the node requested is the "BODY"
    // Then we return the base node this specific <amp-script> comes from.
    // This encapsulates each <amp-script> node.
    return BASE_ELEMENT as RenderableElement;
  }
  return node as RenderableElement;
}

/**
 * Establish link between DOM `node` and worker-generated identifier `id`.
 *
 * These _shouldn't_ collide between instances of <amp-script> since
 * each element creates it's own pool on both sides of the worker
 * communication bridge.
 * @param node
 * @param id
 */
export function storeNode(node: HTMLElement | SVGElement | Text, id: number): void {
  (node as RenderableElement)._index_ = id;
  NODES.set(id, node as RenderableElement);
}