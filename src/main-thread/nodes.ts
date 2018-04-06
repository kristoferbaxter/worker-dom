// /**
//  * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *      http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS-IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import { TransferrableNode } from '../transfer/TransferrableNode';

// interface RenderableHTMLElement extends HTMLElement {
//   _index_: number;
// }
// interface RenderableSVGElement extends SVGElement {
//   _index_: number;
// }
// interface RenderableText extends Text {
//   _index_: number;
// }
// type RenderableElement = RenderableHTMLElement | RenderableSVGElement | RenderableText;

// export class Nodes {
//   private NODES: Map<number, RenderableElement> = new Map();
//   private baseElement: HTMLElement;

//   constructor(baseElement: Element) {
//     this.baseElement = baseElement as HTMLElement;
//   }

//   /**
//    * Create a real DOM Node from a skeleton Object (`{ nodeType, nodeName, attributes, children, data }`)
//    * @example <caption>Text node</caption>
//    *   createNode({ nodeType:3, data:'foo' })
//    * @example <caption>Element node</caption>
//    *   createNode({ nodeType:1, nodeName:'div', attributes:[{ name:'a', value:'b' }], childNodes:[ ... ] })
//    */
//   public createNode(skeleton: TransferrableNode): RenderableElement {
//     if (skeleton.nodeType === Node.TEXT_NODE) {
//       const node = document.createTextNode(skeleton.textContent);
//       this.storeNode(node, skeleton._index_);
//       return node as RenderableElement;
//     }

//     const node = document.createElement(skeleton.nodeName);
//     skeleton.attributes.forEach(attributes => {
//       Object.keys(attributes).forEach(attribute => {
//         node.setAttributeNS
//       });
//       // node.setAttribute(attribute, skeleton.attributes[attribute]);
//     })

//     const attributesKeys = Object.keys(skeleton.attributes);
//     if (attributesKeys.length > 0) {
//       attributesKeys.forEach(key => {
//         node.setAttribute(key, skeleton.attributes[key]);
//       });
//     }

//     if (skeleton.className) {
//       node.className = (skeleton as TransferrableNode).className;
//     }
//     if (skeleton.style) {
//       for (let i in skeleton.style) {
//         node.style[i] = skeleton.style[i];
//       }
//     }
//     if (skeleton.attributes) {
//       let length: number = skeleton.attributes.length;
//       let iterator: number = 0;

//       for (; iterator < length; iterator++) {
//         let attribute = skeleton.attributes[iterator];
//         node.setAttribute(attribute.name, attribute.value);
//       }
//     }
//     if (skeleton.childNodes) {
//       for (let childNode of skeleton.childNodes) {
//         node.appendChild(this.createNode(childNode));
//       }
//     }
//     this.storeNode(node, skeleton.__id);
//     return node;
//   }

//   /**
//    * Returns the real DOM Element corresponding to a serialized Element object.
//    * @param id
//    * @returns
//    */
//   public getNode(id: number): RenderableElement {
//     const node = this.NODES.get(id);

//     if (node && node.nodeName === 'BODY') {
//       // If the node requested is the "BODY"
//       // Then we return the base node this specific <amp-script> comes from.
//       // This encapsulates each <amp-script> node.
//       return this.baseElement;
//     }
//     return node;
//   }

//   /**
//    * Establish link between DOM `node` and worker-generated identifier `id`.
//    *
//    * These _shouldn't_ collide between instances of <amp-script> since
//    * each element creates it's own pool on both sides of the worker
//    * communication bridge.
//    * @param node
//    * @param id
//    */
//   public storeNode(node: HTMLElement | SVGElement | Text, id: number): void {
//     (node as RenderableElement)._index_ = id;
//     this.NODES.set(id, node as RenderableElement);
//   }
// }
