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

import { getNode, storeNode } from './nodes';
import { TransferrableElement, TransferrableText, TransferrableNode } from '../transfer/TransferrableNodes';
import { NodeType } from '../worker-thread/dom/Node';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { RenderableElement } from './RenderableElement';
import { NumericBoolean } from '../utils';
import { process, applyDefaultChangeListener } from './command';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

const allTextNodes = (nodes: NodeList | Array<TransferrableElement>): boolean =>
  nodes.length > 0 &&
  [].every.call(
    nodes,
    (node: Node | TransferrableElement): boolean => ('nodeType' in node ? node.nodeType : node[TransferrableKeys.nodeType]) === NodeType.TEXT_NODE,
  );

/**
 * Process MutationRecord from worker thread by comparing it versus the current DOM.
 * @param hydrationFromWorker contains mutations to compare or apply
 */
export function hydrate(mutations: TransferrableMutationRecord[], baseElement: Element, worker: Worker): void {
  // TODO(KB): Hydrations are not allowed to contain TransferredNodes.
  // Perhaps we should create a TransferrableHydrationRecord.
  const commands: TransferrableMutationRecord[] = [];
  mutations.forEach(hydration => {
    if (hydration[TransferrableKeys.type] === MutationRecordType.CHILD_LIST && hydration[TransferrableKeys.addedNodes] !== undefined) {
      (hydration[TransferrableKeys.addedNodes] || []).forEach((nodeToAdd, index) => {
        if (nodeToAdd[TransferrableKeys.transferred] === NumericBoolean.FALSE) {
          const baseNode = getNode(hydration[TransferrableKeys.target][TransferrableKeys._index_]).childNodes[index] || baseElement;
          hydrateNode(baseNode, nodeToAdd as TransferrableNode, baseElement, worker);
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
  commands.forEach(command => process(worker, command));
}

/**
 * Stores the passed node and ensures all valid childNodes are hydrated.
 * @param node Real Node in DOM.
 * @param skeleton Skeleton Node representation created by WorkerDOM and transmitted across threads.
 */
function hydrateElement(node: RenderableElement, skeleton: TransferrableNode, baseElement: Element, worker: Worker): void {
  if ((skeleton as TransferrableText)[TransferrableKeys.textContent]) {
    node.textContent = (skeleton as TransferrableText)[TransferrableKeys.textContent];
  }

  storeNode(node, skeleton[TransferrableKeys._index_]);

  // When hydrating an HTMLElement, there are some values that need to be synced to the background
  // independently of if the background code has subscribed to an event on the Element.
  // Primary Case: `<form><input><button onClick={function(){console.log(input.value)}} /></form>`
  applyDefaultChangeListener(worker, node);

  ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).forEach(
    (childNode: TransferrableNode, index: number): void => hydrateNode(node.childNodes[index], childNode, baseElement, worker),
  );
}

/**
 * Compares the current node in DOM versus the skeleton provided during Hydration from worker thread.
 * Also, attempt to rationalize equivalence in output, but different by transmission nature.
 * @param node Real Node in DOM
 * @param skeleton Skeleton Node representation created by WorkerDOM and transmitted across threads.
 */
function hydrateNode(node: Node, skeleton: TransferrableNode, baseElement: Element, worker: Worker): void {
  if (node.childNodes.length !== ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).length) {
    // A limited number of cases when the number of childNodes doesn't match is allowable.
    if (allTextNodes(node.childNodes)) {
      if ((skeleton as TransferrableText)[TransferrableKeys.textContent]) {
        // Node with textContent but represented in SSR as Node.childNodes = [Text]
        node.textContent = (skeleton as TransferrableText)[TransferrableKeys.textContent];
        storeNode(node as RenderableElement, skeleton[TransferrableKeys._index_]);
      } else if (allTextNodes((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || [])) {
        // Node with single textContent represented by multiple Text siblings.
        // Some frameworks will create multiple Text nodes for a string, since it means they can update specific segments by direct reference.
        // Hello, {name} => [Text('Hello, '), Text('user')]... Node.childNodes[1].textContent = 'another user';
        node.removeChild(node.childNodes[0]);
        ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).forEach(skeletonChild => {
          const skeletonText = document.createTextNode((skeletonChild as TransferrableText)[TransferrableKeys.textContent]);
          node.appendChild(skeletonText);
          storeNode(skeletonText as RenderableElement, skeleton[TransferrableKeys._index_]);
        });
      }
      return;
    }

    const validSkeletonChildren: Array<TransferrableNode> = ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).filter(
      childNode =>
        !(
          (childNode as TransferrableText)[TransferrableKeys.nodeType] === NodeType.TEXT_NODE &&
          (childNode as TransferrableText)[TransferrableKeys.textContent] === ''
        ),
    );
    if (validSkeletonChildren.length === node.childNodes.length) {
      hydrateElement(node as RenderableElement, skeleton, baseElement, worker);
    }
  } else {
    hydrateElement(node as RenderableElement, skeleton, baseElement, worker);
  }
}
