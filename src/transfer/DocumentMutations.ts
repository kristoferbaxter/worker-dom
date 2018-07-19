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

import { Node } from '../worker-thread/dom/Node';
import { Document } from '../worker-thread/dom/Document';
import { MutationRecord } from '../worker-thread/MutationRecord';
import { TransferableMutationRecord } from './TransferableRecord';
import { TransferableNode, TransferredNode } from './TransferableNodes';
import { MutationFromWorker, MessageType } from './Messages';

const SUPPORTS_POST_MESSAGE = typeof postMessage !== 'undefined';
const sanitizeNodes = (nodes: Node[] | undefined): Array<TransferableNode | TransferredNode> | undefined =>
  (nodes && nodes.map(node => node._sanitize_())) || undefined;
let observing = false;
let hydrated = false;

function handleMutations(incomingMutations: MutationRecord[]): void {
  const mutations: TransferableMutationRecord[] = [];

  incomingMutations.forEach(mutation => {
    let transferableMutation: TransferableMutationRecord = {
      target: mutation.target._sanitize_(),
      addedNodes: sanitizeNodes(mutation.addedNodes),
      removedNodes: sanitizeNodes(mutation.removedNodes),
      previousSibling: mutation.previousSibling && mutation.previousSibling._sanitize_(),
      nextSibling: mutation.nextSibling && mutation.nextSibling._sanitize_(),
      attributeName: mutation.attributeName,
      attributeNamespace: mutation.attributeNamespace,
      oldValue: mutation.oldValue,
      type: mutation.type,
      propertyName: mutation.propertyName,
      value: mutation.value,
      addedEvents: mutation.addedEvents,
      removedEvents: mutation.removedEvents,
    };
    Object.keys(transferableMutation).forEach(key => transferableMutation[key] === undefined && delete transferableMutation[key]);

    mutations.push(transferableMutation);
  });

  if (SUPPORTS_POST_MESSAGE) {
    const mutationFromWorker: MutationFromWorker = {
      type: hydrated ? MessageType.MUTATE : MessageType.HYDRATE,
      mutations,
    };
    hydrated = true;

    postMessage(mutationFromWorker);
  }
}

export function observe(document: Document): void {
  if (!observing) {
    new document.defaultView.MutationObserver(handleMutations).observe(document.body);
    observing = true;
  }
}
