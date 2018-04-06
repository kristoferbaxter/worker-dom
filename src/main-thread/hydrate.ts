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

// // import { Nodes } from './nodes';
// // import { TransferrableMutationRecord, TransferrableNode, RenderableElement } from '../types';
// import {TransferrableNode} from '../transfer/TransferrableNode';
// import { NodeType } from '../worker-thread/Node';

// const allTextNodes = (nodes: NodeList | TransferrableNode[]): boolean => nodes.length > 0 && [].every.call(nodes, (node: Node | TransferrableNode): boolean => node.nodeType === NodeType.TEXT_NODE);

// export class Hydration {
//   nodesInstance: Nodes;
//   baseElement: HTMLElement;

//   constructor(baseElement: Element, nodesInstance: Nodes) {
//     this.nodesInstance = nodesInstance;
//     this.baseElement = baseElement as HTMLElement;
//   }

//   public hydrate(hydrations: TransferrableMutationRecord[]) {
//     for (let hydration of hydrations) {
//       console.info('Hydrating root: ', this.baseElement);
//       if (hydration.type === 'childList') {
//         console.assert(hydration.addedNodes.length > 0);
//         for (let nodeToAdd of hydration.addedNodes) {
//           const baseNode = this.nodesInstance.getNode(nodeToAdd.__id) || this.baseElement;
//           this.hydrateNode(baseNode, nodeToAdd);
//         }
//       }
//       // TODO - KB, Hydration can include changes to props and attrs.
//       // Let's allow mutation of attrs/props during hydration.
//     }
//   }

//   /**
//    *
//    * @param node
//    * @param skeleton
//    */
//   private hydrateNode(node: Node, skeleton: TransferrableNode): void {
//     console.assert(node.nodeType == skeleton.nodeType);
//     console.assert(node.nodeName == skeleton.nodeName);
//     if (node.childNodes.length !== skeleton.childNodes.length) {
//       // If the number of childNodes is not equivalent, this can be ok.
//       if (allTextNodes(node.childNodes)) {
//         if (skeleton.textContent) {
//           // This case is a node with textContent
//           // but represented in SSR as Node.childNodes = [Text]
//           node.textContent = skeleton.textContent;
//           this.nodesInstance.storeNode(node as RenderableElement, skeleton.__id);
//         } else if (allTextNodes(skeleton.childNodes)) {
//           // Some frameworks split text nodes into multiple nodes.
//           node.removeChild(node.childNodes[0]);
//           skeleton.childNodes.forEach(skeletonChild => {
//             const skeletonText = document.createTextNode(skeletonChild.textContent);
//             node.appendChild(skeletonText);
//             this.nodesInstance.storeNode(skeletonText as RenderableElement, skeleton.__id);
//           });
//         }
//       }
//     } else {
//       console.assert(node.childNodes.length == skeleton.childNodes.length);
//       // console.assert(node.__id == skeleton.__id); TODO(KB) – Restore this assertion.

//       if (skeleton.textContent) {
//         node.textContent = skeleton.textContent;
//       }

//       this.nodesInstance.storeNode(node as RenderableElement, skeleton.__id);
//       let iterator: number = 0;
//       const length: number = skeleton.childNodes.length;
//       for (; iterator < length; iterator++) {
//         this.hydrateNode(node.childNodes[iterator], skeleton.childNodes[iterator] as TransferrableNode);
//       }
//     }
//   }
// }
