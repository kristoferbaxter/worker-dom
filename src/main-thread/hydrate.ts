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
import { TransferrableNode, TransferredNode } from '../transfer/TransferrableNodes';
import { NodeType } from '../worker-thread/dom/Node';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { RenderableElement } from './RenderableElement';
import { NumericBoolean } from '../utils';
import { process, applyDefaultChangeListener } from './command';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

const allTextNodes = (nodes: NodeList | Array<TransferrableNode | TransferredNode>): boolean =>
  nodes.length > 0 &&
  [].every.call(
    nodes,
    (node: Node | TransferrableNode): boolean =>
      ('nodeType' in node ? node.nodeType : (node as TransferrableNode)[TransferrableKeys.nodeType]) === NodeType.TEXT_NODE,
  );

export class Hydration {
  private nodesInstance_: Nodes;
  private baseElement_: HTMLElement;
  private worker_: Worker;

  constructor(baseElement_: Element, nodesInstance_: Nodes, worker: Worker) {
    this.nodesInstance_ = nodesInstance_;
    this.baseElement_ = baseElement_ as HTMLElement;
    this.worker_ = worker;
  }

  /**
   * Process MutationRecord from worker thread by comparing it versus the current DOM.
   * @param hydrationFromWorker contains mutations to compare or apply
   */
  public process(mutations: TransferrableMutationRecord[]): void {
    // TODO(KB): Hydrations are not allowed to contain TransferredNodes.
    // Perhaps we should create a TransferrableHydrationRecord.
    const commands: TransferrableMutationRecord[] = [];
    mutations.forEach(hydration => {
      if (hydration[TransferrableKeys.type] === MutationRecordType.CHILD_LIST && hydration[TransferrableKeys.addedNodes] !== undefined) {
        (hydration[TransferrableKeys.addedNodes] || []).forEach((nodeToAdd, index) => {
          if (nodeToAdd[TransferrableKeys.transferred] === NumericBoolean.FALSE) {
            const baseNode =
              this.nodesInstance_.getNode(nodeToAdd[TransferrableKeys._index_]) ||
              this.nodesInstance_.getNode(hydration[TransferrableKeys.target][TransferrableKeys._index_]).childNodes[index] ||
              this.baseElement_;
            this.hydrateNode_(baseNode, nodeToAdd as TransferrableNode);
          }
        });
        // TODO(KB): Hydration can include changes to props and attrs. Let's allow mutation of attrs/props during hydration.
      } else if (hydration[TransferrableKeys.type] === MutationRecordType.COMMAND) {
        commands.push(hydration);
      }
    });
    // Processing order matters.
    // For instance, Element.addEventListener requires the Element to exist first.
    // Commands pass only the identifier for an element, and identifiers are stored in the main thread after the elements are created.
    commands.forEach(hydration => process(this.nodesInstance_, this.worker_, hydration));
  }

  /**
   * Stores the passed node and ensures all valid childNodes are hydrated.
   * @param node Real Node in DOM.
   * @param skeleton Skeleton Node representation created by WorkerDOM and transmitted across threads.
   */
  private hydrateElement_(node: RenderableElement, skeleton: TransferrableNode): void {
    if (skeleton[TransferrableKeys.textContent]) {
      node.textContent = skeleton[TransferrableKeys.textContent];
    }

    this.nodesInstance_.storeNode(node, skeleton[TransferrableKeys._index_]);

    // When hydrating an HTMLElement, there are some values that need to be synced to the background
    // independently of if the background code has subscribed to an event on the Element.
    // Primary Case: `<form><input><button onClick={function(){console.log(input.value)}} /></form>`
    applyDefaultChangeListener(this.worker_, node);

    (skeleton[TransferrableKeys.childNodes] || []).forEach(
      (childNode: TransferrableNode | TransferredNode, index: number): void =>
        this.hydrateNode_(node.childNodes[index], childNode as TransferrableNode),
    );
  }

  /**
   * Compares the current node in DOM versus the skeleton provided during Hydration from worker thread.
   * Also, attempt to rationalize equivalence in output, but different by transmission nature.
   * @param node Real Node in DOM
   * @param skeleton Skeleton Node representation created by WorkerDOM and transmitted across threads.
   */
  private hydrateNode_(node: Node, skeleton: TransferrableNode): void {
    if (node.childNodes.length !== (skeleton[TransferrableKeys.childNodes] || []).length) {
      // A limited number of cases when the number of childNodes doesn't match is allowable.
      if (allTextNodes(node.childNodes)) {
        if (skeleton[TransferrableKeys.textContent]) {
          // Node with textContent but represented in SSR as Node.childNodes = [Text]
          node.textContent = skeleton[TransferrableKeys.textContent];
          this.nodesInstance_.storeNode(node as RenderableElement, skeleton[TransferrableKeys._index_]);
        } else if (allTextNodes(skeleton[TransferrableKeys.childNodes])) {
          // Node with single textContent represented by multiple Text siblings.
          // Some frameworks will create multiple Text nodes for a string, since it means they can update specific segments by direct reference.
          // Hello, {name} => [Text('Hello, '), Text('user')]... Node.childNodes[1].textContent = 'another user';
          node.removeChild(node.childNodes[0]);
          skeleton[TransferrableKeys.childNodes].forEach(skeletonChild => {
            const skeletonText = document.createTextNode((skeletonChild as TransferrableNode)[TransferrableKeys.textContent]);
            node.appendChild(skeletonText);
            this.nodesInstance_.storeNode(skeletonText as RenderableElement, skeleton[TransferrableKeys._index_]);
          });
        }
        return;
      }

      const validSkeletonChildren: TransferrableNode[] = (skeleton[TransferrableKeys.childNodes] as TransferrableNode[]).filter(
        childNode => !(childNode[TransferrableKeys.nodeType] === NodeType.TEXT_NODE && childNode[TransferrableKeys.textContent] === ''),
      );
      if (validSkeletonChildren.length === node.childNodes.length) {
        this.hydrateElement_(node as RenderableElement, skeleton);
      }
    } else {
      this.hydrateElement_(node as RenderableElement, skeleton);
    }
  }
}
