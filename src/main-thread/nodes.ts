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

import { TransferrableNode } from '../transfer/TransferrableNodes';
import { RenderableElement } from './RenderableElement';
import { NumericBoolean } from '../utils';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

export class Nodes {
  private NODES_: Map<number, RenderableElement>;
  private baseElement_: HTMLElement;

  constructor(baseElement: Element) {
    // The document element is constructed before the worker MutationObserver is attached.
    // As a result, we must manually store the reference node for the main thread.
    // The first entry is the "document", the second entry is "document.body".
    this.NODES_ = new Map([[1, baseElement as RenderableElement], [2, baseElement as RenderableElement]]);
    this.baseElement_ = baseElement as HTMLElement;
  }

  /**
   * Create a real DOM Node from a skeleton Object (`{ nodeType, nodeName, attributes, children, data }`)
   * @example <caption>Text node</caption>
   *   createNode({ nodeType:3, data:'foo' })
   * @example <caption>Element node</caption>
   *   createNode({ nodeType:1, nodeName:'div', attributes:[{ name:'a', value:'b' }], childNodes:[ ... ] })
   */
  public createNode(skeleton: TransferrableNode): RenderableElement {
    if (skeleton[TransferrableKeys.nodeType] === Node.TEXT_NODE) {
      const node = document.createTextNode(skeleton[TransferrableKeys.textContent]);
      this.storeNode(node, skeleton[TransferrableKeys._index_]);
      return node as RenderableElement;
    }

    let node: HTMLElement | SVGElement;
    if (skeleton[TransferrableKeys.namespaceURI]) {
      node = document.createElementNS(skeleton[TransferrableKeys.namespaceURI], skeleton[TransferrableKeys.nodeName]) as SVGElement;
    } else {
      node = document.createElement(skeleton[TransferrableKeys.nodeName]);
    }
    skeleton[TransferrableKeys.attributes].forEach(attribute => {
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
    (skeleton[TransferrableKeys.childNodes] || []).forEach(childNode => {
      if (childNode[TransferrableKeys.transferred] === NumericBoolean.FALSE) {
        node.appendChild(this.createNode(childNode as TransferrableNode));
      }
    });

    this.storeNode(node, skeleton[TransferrableKeys._index_]);
    return node as RenderableElement;
  }

  /**
   * Returns the real DOM Element corresponding to a serialized Element object.
   * @param id
   * @return
   */
  public getNode(id: number): RenderableElement {
    const node = this.NODES_.get(id);

    if (node && node.nodeName === 'BODY') {
      // If the node requested is the "BODY"
      // Then we return the base node this specific <amp-script> comes from.
      // This encapsulates each <amp-script> node.
      return this.baseElement_ as RenderableElement;
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
  public storeNode(node: HTMLElement | SVGElement | Text, id: number): void {
    (node as RenderableElement)._index_ = id;
    this.NODES_.set(id, node as RenderableElement);
  }
}
