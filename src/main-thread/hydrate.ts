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

import { Nodes } from './nodes';
import { TransferableMutationRecord } from '../transfer/TransferableRecord';
import { TransferableNode, TransferredNode } from '../transfer/TransferableNodes';
import { NodeType } from '../worker-thread/Node';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { RenderableElement } from './RenderableElement';
import { NumericBoolean } from '../utils';

const allTextNodes = (nodes: NodeList | Array<TransferableNode | TransferredNode>): boolean =>
  nodes.length > 0 && [].every.call(nodes, (node: Node | TransferableNode): boolean => node.nodeType === NodeType.TEXT_NODE);

export class Hydration {
  nodesInstance: Nodes;
  baseElement: HTMLElement;

  constructor(baseElement: Element, nodesInstance: Nodes) {
    this.nodesInstance = nodesInstance;
    this.baseElement = baseElement as HTMLElement;
  }

  public process(hydrations: TransferableMutationRecord[]) {
    // TODO(KB): Hydrations are not allowed to contain TransferredNodes.
    // Perhaps we should create a TransferableHydrationRecord.
    for (let hydration of hydrations) {
      if (hydration.type === MutationRecordType.CHILD_LIST && hydration.addedNodes !== null) {
        for (let nodeToAdd of hydration.addedNodes) {
          const baseNode = this.nodesInstance.getNode(nodeToAdd._index_) || this.baseElement;
          if (nodeToAdd.transferred === NumericBoolean.FALSE) {
            this.hydrateNode(baseNode, nodeToAdd as TransferableNode);
          }
        }
      }
      // TODO(KB): Hydration can include changes to props and attrs. Let's allow mutation of attrs/props during hydration.
    }
  }

  /**
   *
   * @param node
   * @param skeleton
   */
  private hydrateNode(node: Node, skeleton: TransferableNode): void {
    if (node.childNodes.length !== skeleton.childNodes.length) {
      // A limited number of cases when the number of childNodes doesn't match is allowable.
      if (allTextNodes(node.childNodes)) {
        if (skeleton.textContent) {
          // Node with textContent but represented in SSR as Node.childNodes = [Text]
          node.textContent = skeleton.textContent;
          this.nodesInstance.storeNode(node as RenderableElement, skeleton._index_);
        } else if (allTextNodes(skeleton.childNodes)) {
          // Node with single textContent represented by multiple Text siblings.
          // Some frameworks will create multiple Text nodes for a string, since it means they can update specific segments by direct reference.
          // Hello, {name} => [Text('Hello, '), Text('user')]... Node.childNodes[1].textContent = 'another user';
          node.removeChild(node.childNodes[0]);
          skeleton.childNodes.forEach(skeletonChild => {
            const skeletonText = document.createTextNode((skeletonChild as TransferableNode).textContent);
            node.appendChild(skeletonText);
            this.nodesInstance.storeNode(skeletonText as RenderableElement, skeleton._index_);
          });
        }
      }
    } else {
      if (skeleton.textContent) {
        node.textContent = skeleton.textContent;
      }

      this.nodesInstance.storeNode(node as RenderableElement, skeleton._index_);
      skeleton.childNodes.forEach((childNode: TransferableNode | TransferredNode, index: number): void =>
        this.hydrateNode(node.childNodes[index], childNode as TransferableNode),
      );
    }
  }
}
