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

import { Node } from '../worker-thread/Node';
import { Document } from '../worker-thread/Document';
import { MutationRecord } from '../worker-thread/MutationRecord';
import { TransferableMutationRecord } from './TransferableRecord';
import { TransferableNode, TransferredNode } from './TransferableNodes';
import { MutationFromWorker, MessageType } from './Messages';

const SUPPORTS_POST_MESSAGE = typeof postMessage !== 'undefined';
const sanitizeNodes = (nodes: Node[] | undefined): Array<TransferableNode | TransferredNode> | null =>
  (nodes && nodes.map(node => node._sanitize_())) || null;
let observing = false;
let hydrated = false;

function handleMutations(incomingMutations: MutationRecord[]): void {
  const mutations: TransferableMutationRecord[] = [];

  incomingMutations.forEach(mutation => {
    mutations.push({
      target: mutation.target._sanitize_(),
      addedNodes: sanitizeNodes(mutation.addedNodes),
      removedNodes: sanitizeNodes(mutation.removedNodes),
      previousSibling: (mutation.previousSibling && mutation.previousSibling._sanitize_()) || null,
      nextSibling: (mutation.nextSibling && mutation.nextSibling._sanitize_()) || null,
      attributeName: mutation.attributeName || null,
      attributeNamespace: mutation.attributeNamespace || null,
      oldValue: mutation.oldValue === '' ? '' : mutation.oldValue || null,
      type: mutation.type,
      propertyName: mutation.propertyName || null,
      value: mutation.value === '' ? '' : mutation.value || null,
      addedEvents: mutation.addedEvents || null,
      removedEvents: mutation.removedEvents || null,
      measure: null,
    });
  });

  if (SUPPORTS_POST_MESSAGE) {
    const mutationFromWorker: MutationFromWorker = {
      type: hydrated ? MessageType.MUTATE : MessageType.HYDRATE,
      mutations,
    };
    hydrated = true;

    postMessage(JSON.parse(JSON.stringify(mutationFromWorker)));
  }
}

export function observe(document: Document): void {
  if (!observing) {
    new document.defaultView.MutationObserver(handleMutations).observe(document.body);
    observing = true;
  }
}
