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
import { TransferrableMutationRecord, TransferrableHydrationRecord } from './TransferrableRecord';
import { TransferrableNode, TransferredNode } from './TransferrableNodes';
import { MutationFromWorker, MessageType, HydrationFromWorker } from './Messages';
import { TransferrableKeys } from './TransferrableKeys';
import { TransferrableHydrationEventSubsciption } from './TransferrableEvent';

const SUPPORTS_POST_MESSAGE = typeof postMessage !== 'undefined';
const serializeNodes = (nodes: Node[] | undefined): Array<TransferrableNode | TransferredNode> | undefined =>
  (nodes && nodes.map(node => node.serialize())) || undefined;
let observing = false;
let hydrated = false;
let document: Document;

/*
interface HydrationFromWorker {
  type: MessageType.HYDRATE;
  hydration: TransferrableHydrationRecord;
  events: TransferrableEventSubscriptionChange[];
}
export interface TransferrableHydrationRecord {
  readonly [TransferrableKeys.addedNodes]: Array<TransferrableHydrateableNode>;
}
export type TransferrableHydrateableNode = TransferrableHydrateableElement | TransferrableText;

export interface TransferrableHydrateableElement extends TransferredNode {
  readonly [TransferrableKeys.nodeType]: NodeType;
  readonly [TransferrableKeys.nodeName]: NodeName;
  readonly [TransferrableKeys.attributes]?: TransferrableKeyValues;
  readonly [TransferrableKeys.properties]?: TransferrableKeyValues;
  readonly [TransferrableKeys.namespaceURI]?: string;
  readonly [TransferrableKeys.childNodes]?: Array<TransferrableHydrateableElement | TransferrableText>;
}
export interface TransferrableText extends TransferredNode {
  readonly [TransferrableKeys.nodeType]: NodeType;
  readonly [TransferrableKeys.nodeName]: NodeName;
  readonly [TransferrableKeys.textContent]: string;
}
export interface TransferredNode {
  readonly [TransferrableKeys._index_]: number;
  readonly [TransferrableKeys.transferred]: NumericBoolean;
}
*/

function handleHydration(incomingMutations: MutationRecord[]): void {
  const hydration: TransferrableHydrationRecord = {
    [TransferrableKeys.addedNodes]: document.body.hydrate(),
  };
  let events: TransferrableHydrationEventSubsciption[] = [];

  // debugger;
  incomingMutations.forEach(mutation => {
    if (mutation.addedEvents) {
      events = events.concat(
        mutation.addedEvents.map(addedEvent => {
          return {
            [TransferrableKeys.type]: addedEvent[TransferrableKeys.type],
            [TransferrableKeys._index_]: mutation.target._index_,
            [TransferrableKeys.index]: addedEvent[TransferrableKeys.index],
          };
        }),
      );
    }
  });

  if (SUPPORTS_POST_MESSAGE) {
    postMessage({
      type: MessageType.HYDRATE,
      hydration,
      events,
    } as HydrationFromWorker);
  }
  hydrated = true;
}

function handleMutations(incomingMutations: MutationRecord[]): void {
  if (hydrated === false) {
    handleHydration(incomingMutations);
    return;
  }

  const mutations: TransferrableMutationRecord[] = [];
  incomingMutations.forEach(mutation => {
    let transferableMutation: TransferrableMutationRecord = {
      [TransferrableKeys.type]: mutation.type,
      [TransferrableKeys.target]: mutation.target._index_,
    };

    mutation.addedNodes && (transferableMutation[TransferrableKeys.addedNodes] = serializeNodes(mutation.addedNodes));
    mutation.removedNodes && (transferableMutation[TransferrableKeys.removedNodes] = serializeNodes(mutation.removedNodes));
    mutation.nextSibling && (transferableMutation[TransferrableKeys.nextSibling] = mutation.nextSibling.serialize());
    mutation.attributeName != null && (transferableMutation[TransferrableKeys.attributeName] = mutation.attributeName);
    mutation.attributeNamespace != null && (transferableMutation[TransferrableKeys.attributeNamespace] = mutation.attributeNamespace);
    mutation.oldValue != null && (transferableMutation[TransferrableKeys.oldValue] = mutation.oldValue);
    mutation.propertyName && (transferableMutation[TransferrableKeys.propertyName] = mutation.propertyName);
    mutation.value != null && (transferableMutation[TransferrableKeys.value] = mutation.value);
    mutation.addedEvents && (transferableMutation[TransferrableKeys.addedEvents] = mutation.addedEvents);
    mutation.removedEvents && (transferableMutation[TransferrableKeys.removedEvents] = mutation.removedEvents);

    mutations.push(transferableMutation);
  });

  if (SUPPORTS_POST_MESSAGE) {
    postMessage({
      type: MessageType.MUTATE,
      mutations,
    } as MutationFromWorker);
  }
}

export function observe(doc: Document): void {
  if (!observing) {
    document = doc;
    new doc.defaultView.MutationObserver(handleMutations).observe(doc.body);
    observing = true;
  }
}
