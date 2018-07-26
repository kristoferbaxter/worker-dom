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
import { stringPosition, transfer as transferStringPool } from './StringPool';

const SUPPORTS_POST_MESSAGE = typeof postMessage !== 'undefined';
const serializeNodes = (nodes: Node[] | undefined): Array<TransferableNode | TransferredNode> | undefined =>
  (nodes && nodes.map(node => node.serialize())) || undefined;
let observing = false;
let hydrated = false;

function handleMutations(incomingMutations: MutationRecord[]): void {
  const mutations: TransferableMutationRecord[] = [];

  incomingMutations.forEach(mutation => {
    debugger;
    let transferableMutation: TransferableMutationRecord = {
      type: mutation.type,
      target: mutation.target.serialize(),
    };
    if (mutation.addedNodes) {
      transferableMutation.addedNodes = serializeNodes(mutation.addedNodes);
    }
    if (mutation.removedNodes) {
      transferableMutation.removedNodes = serializeNodes(mutation.removedNodes);
    }
    if (mutation.nextSibling) {
      transferableMutation.nextSibling = mutation.nextSibling.serialize();
    }
    if (mutation.attributeName != null) {
      transferableMutation.attributeName = stringPosition(mutation.attributeName);
    }
    if (mutation.attributeNamespace) {
      transferableMutation.attributeNamespace = stringPosition(mutation.attributeNamespace);
    }
    if (mutation.oldValue) {
      transferableMutation.oldValue = stringPosition(mutation.oldValue);
    }
    if (mutation.propertyName) {
      transferableMutation.propertyName = stringPosition(mutation.propertyName);
    }
    if (mutation.value) {
      transferableMutation.value = stringPosition(mutation.value);
    }
    if (mutation.addedEvents) {
      transferableMutation.addedEvents = mutation.addedEvents;
    }
    if (mutation.removedEvents) {
      transferableMutation.removedEvents = mutation.removedEvents;
    }

    mutations.push(transferableMutation);
  });

  debugger;
  if (SUPPORTS_POST_MESSAGE) {
    const mutationFromWorker: MutationFromWorker = {
      type: hydrated ? MessageType.MUTATE : MessageType.HYDRATE,
      mutations,
      strings: transferStringPool(),
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
