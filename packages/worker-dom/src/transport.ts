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

import { get as getNode } from './NodeMapping';
import { Event } from './Event';
import { MutationRecord } from './MutationRecord';
import { Node } from './dom/Node';
import { Document } from './dom/Document';
import { MessageToWorker, MutationFromWorker, MessageType, ValueSyncToWorker } from '@ampproject/worker-dom-transport/src/Messages';
import { TransferrableKeys } from '@ampproject/worker-dom-transport/src/TransferrableKeys';
import { TransferrableEvent } from '@ampproject/worker-dom-transport/src/TransferrableEvent';
import { TransferrableNode, TransferredNode } from '@ampproject/worker-dom-transport/src/TransferrableNodes';
import { TransferrableMutationRecord } from '@ampproject/worker-dom-transport/src/TransferrableRecord';

const SUPPORTS_POST_MESSAGE = typeof postMessage !== 'undefined';
const serializeNodes = (nodes: Node[] | undefined): Array<TransferrableNode | TransferredNode> | undefined =>
  (nodes && nodes.map(node => node.serialize())) || undefined;
let observing = false;
let hydrated = false;

function listen(): void {
  if (SUPPORTS_POST_MESSAGE) {
    /**
     * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
     * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
     * method to dispatch the transfered event in the worker thread.
     */
    addEventListener('message', ({ data }: { data: MessageToWorker }) => {
      if (data[TransferrableKeys.type] === MessageType.SYNC) {
        const sync = (data as ValueSyncToWorker)[TransferrableKeys.sync];
        const node = getNode(sync[TransferrableKeys._index_]);
        if (node) {
          node.value = sync[TransferrableKeys.value];
        }
      } else if (data[TransferrableKeys.type] === MessageType.EVENT) {
        const event = data[TransferrableKeys.event] as TransferrableEvent;
        const node = getNode(event[TransferrableKeys._index_]);
        if (node !== null) {
          const target = event[TransferrableKeys.target];
          node.dispatchEvent(
            Object.assign(
              new Event(event[TransferrableKeys.type], { bubbles: event[TransferrableKeys.bubbles], cancelable: event[TransferrableKeys.cancelable] }),
              {
                cancelBubble: event[TransferrableKeys.cancelBubble],
                defaultPrevented: event[TransferrableKeys.defaultPrevented],
                eventPhase: event[TransferrableKeys.eventPhase],
                isTrusted: event[TransferrableKeys.isTrusted],
                returnValue: event[TransferrableKeys.returnValue],
                target: getNode(target ? target[TransferrableKeys._index_] : null),
                timeStamp: event[TransferrableKeys.timeStamp],
                scoped: event[TransferrableKeys.scoped],
              },
            ),
          );
        }
      }
    });
  }
}

function handleMutations(incomingMutations: MutationRecord[]): void {
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

  if (SUPPORTS_POST_MESSAGE) {
    const mutationFromWorker: MutationFromWorker = {
      type: hydrated ? MessageType.MUTATE : MessageType.HYDRATE,
      mutations,
    };
    hydrated = true;

    postMessage(mutationFromWorker);
  }
}

export function enableTransport(document: Document): void {
  if (SUPPORTS_POST_MESSAGE && !observing) {
    new document.defaultView.MutationObserver(handleMutations).observe(document.body);
    listen();
    observing = true;
  }
}
