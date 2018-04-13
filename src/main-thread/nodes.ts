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

import { TransferrableNode } from '../transfer/TransferrableNode';
import { RenderableElement } from './RenderableElement';

export class Nodes {
  private NODES: Map<number, RenderableElement> = new Map();
  private baseElement: HTMLElement;

  constructor(baseElement: Element) {
    this.baseElement = baseElement as HTMLElement;
  }

  /**
   * Create a real DOM Node from a skeleton Object (`{ nodeType, nodeName, attributes, children, data }`)
   * @example <caption>Text node</caption>
   *   createNode({ nodeType:3, data:'foo' })
   * @example <caption>Element node</caption>
   *   createNode({ nodeType:1, nodeName:'div', attributes:[{ name:'a', value:'b' }], childNodes:[ ... ] })
   */
  public createNode(skeleton: TransferrableNode): RenderableElement {
    if (skeleton.nodeType === Node.TEXT_NODE) {
      const node = document.createTextNode(skeleton.textContent);
      this.storeNode(node, skeleton._index_);
      return node as RenderableElement;
    }

    const node = document.createElement(skeleton.nodeName);
    skeleton.attributes.forEach(attribute => {
      node.setAttributeNS(attribute.namespaceURI, attribute.name, attribute.value);
    });
    // TODO(KB): Restore Properties
    // skeleton.properties.forEach(property => {
    //   node[`${property.name}`] = property.value;
    // });
    skeleton.childNodes.forEach(childNode => {
      if (!childNode.transferred) {
        node.appendChild(this.createNode(childNode as TransferrableNode));
      }
    });

    this.storeNode(node, skeleton._index_);
    return node as RenderableElement;
  }

  /**
   * Returns the real DOM Element corresponding to a serialized Element object.
   * @param id
   * @returns
   */
  public getNode(id: number): RenderableElement {
    const node = this.NODES.get(id);

    if (node && node.nodeName === 'BODY') {
      // If the node requested is the "BODY"
      // Then we return the base node this specific <amp-script> comes from.
      // This encapsulates each <amp-script> node.
      return this.baseElement as RenderableElement;
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
    this.NODES.set(id, node as RenderableElement);
  }
}
