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
import { TransferrableMutationRecord } from './TransferrableRecord';
import { TransferrableNode, TransferredNode } from './TransferrableNodes';
import { MutationFromWorker, MessageType } from './Messages';
import { TransferrableKeys } from './TransferrableKeys';

const serializeNodes = (nodes: Node[] | undefined): Array<TransferrableNode | TransferredNode> | undefined =>
  (nodes && nodes.map(node => node.serialize())) || undefined;

let observing = false;
let hydrated = false;

function handleMutations(incomingMutations: MutationRecord[], postMessage: Function): void {
  const mutations: TransferrableMutationRecord[] = [];

  incomingMutations.forEach(mutation => {
    let transferableMutation: TransferrableMutationRecord = {
      [TransferrableKeys.type]: mutation.type,
      [TransferrableKeys.target]: mutation.target.serialize(),
    };
    if (mutation.addedNodes) {
      transferableMutation[TransferrableKeys.addedNodes] = serializeNodes(mutation.addedNodes);
    }
    if (mutation.removedNodes) {
      transferableMutation[TransferrableKeys.removedNodes] = serializeNodes(mutation.removedNodes);
    }
    if (mutation.nextSibling) {
      transferableMutation[TransferrableKeys.nextSibling] = mutation.nextSibling.serialize();
    }
    if (mutation.attributeName != null) {
      transferableMutation[TransferrableKeys.attributeName] = mutation.attributeName;
    }
    if (mutation.attributeNamespace != null) {
      transferableMutation[TransferrableKeys.attributeNamespace] = mutation.attributeNamespace;
    }
    if (mutation.oldValue != null) {
      transferableMutation[TransferrableKeys.oldValue] = mutation.oldValue;
    }
    if (mutation.propertyName) {
      transferableMutation[TransferrableKeys.propertyName] = mutation.propertyName;
    }
    if (mutation.value != null) {
      transferableMutation[TransferrableKeys.value] = mutation.value;
    }
    if (mutation.addedEvents) {
      transferableMutation[TransferrableKeys.addedEvents] = mutation.addedEvents;
    }
    if (mutation.removedEvents) {
      transferableMutation[TransferrableKeys.removedEvents] = mutation.removedEvents;
    }

    mutations.push(transferableMutation);
  });

  if (postMessage) {
    const mutationFromWorker: MutationFromWorker = {
      type: hydrated ? MessageType.MUTATE : MessageType.HYDRATE,
      mutations,
    };
    hydrated = true;

    postMessage(mutationFromWorker);
  }
}

export function observe(document: Document, postMessage: Function): void {
  if (!observing) {
    new document.defaultView.MutationObserver(incomingMutations => handleMutations(incomingMutations, postMessage)).observe(document.body);
    observing = true;
  }
}
