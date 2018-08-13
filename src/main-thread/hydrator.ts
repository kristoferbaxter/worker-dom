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

import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { HydrateableNode } from '../transfer/TransferrableNodes';
import { storeNode, getNode, createNode, isTextNode } from './nodes';
import { RenderableElement } from 'RenderableElement';
import { TransferrableEventSubscriptionChange } from '../transfer/TransferrableEvent';
import { applyDefaultChangeListener, processListenerChange } from './command';

function allTextNodes(nodes: NodeList | Array<HydrateableNode>): boolean {
  return nodes.length > 0 && [].every.call(nodes, isTextNode);
}

/**
 *
 * @param nodes
 * @param parent
 * @param worker
 */
function replaceNodes(nodes: Array<HydrateableNode>, parent: HTMLElement, worker: Worker): void {
  [].forEach.call(parent.childNodes, (childNode: Element | Text) => childNode.remove());
  nodes.forEach((node, index) => {
    const newNode: RenderableElement = createNode(node);
    (node[TransferrableKeys.attributes] || []).forEach(attribute => {
      if (attribute.namespaceURI) {
        newNode.setAttributeNS(attribute.namespaceURI, attribute.name, attribute.value);
      } else {
        newNode.setAttribute(attribute.name, attribute.value);
      }
    });
    parent.appendChild(newNode);
    applyDefaultChangeListener(worker, newNode as RenderableElement);

    replaceNodes(node[TransferrableKeys.childNodes] || [], parent.childNodes[index] as HTMLElement, worker);
  });
}

/**
 *
 * @param transferNode
 * @param node
 * @param worker
 */
function hydrateNode(transferNode: HydrateableNode, node: HTMLElement | Text, worker: Worker): void {
  const transferIsText = isTextNode(transferNode);
  const nodeIsText = isTextNode(node);
  if (!transferIsText && !nodeIsText) {
    const childNodes = transferNode[TransferrableKeys.childNodes] || [];
    if (childNodes.length !== node.childNodes.length) {
      // If this parent node has an unequal number of childNodes, we need to ensure its for an allowable reason.
      if (allTextNodes(childNodes) && allTextNodes(node.childNodes)) {
        // Offset due to a differing number of text nodes.
        // replace the current DOM with the text nodes from the hydration.
        replaceNodes(childNodes, node as HTMLElement, worker);
      } else {
        const filteredTransfer = childNodes.filter(childNode => !isTextNode(childNode));
        const filteredNodes = [].filter.call(node.childNodes, (childNode: Node) => !isTextNode(childNode));
        // Empty text nodes are used by frameworks as placeholders for future dom content.
        if (filteredTransfer.length === filteredNodes.length) {
          storeNode(node, transferNode[TransferrableKeys._index_]);
          replaceNodes(childNodes, node as HTMLElement, worker);
        }
      }
    } else {
      storeNode(node, transferNode[TransferrableKeys._index_]);
      applyDefaultChangeListener(worker, node as RenderableElement);
      // Same number of children, hydrate them.
      childNodes.forEach((childNode, index) => hydrateNode(childNode, node.childNodes[index] as HTMLElement | Text, worker));
    }
  } else if (transferIsText && nodeIsText) {
    // Singular text node, no children.
    storeNode(node, transferNode[TransferrableKeys._index_]);
    node.textContent = transferNode[TransferrableKeys.textContent] as string;
    applyDefaultChangeListener(worker, node as RenderableElement);
  }
}

/**
 *
 * @param hydration
 * @param events
 * @param baseElement
 * @param worker
 */
export function hydrate(skeleton: HydrateableNode, addEvents: Array<TransferrableEventSubscriptionChange>, baseElement: HTMLElement, worker: Worker) {
  // Process Node Addition / Removal
  hydrateNode(skeleton, baseElement, worker);
  // Process Event Addition
  addEvents.forEach(event => {
    const node = getNode(event[TransferrableKeys._index_]);
    node && processListenerChange(worker, node, true, event[TransferrableKeys.type], event[TransferrableKeys.index]);
  });
}
