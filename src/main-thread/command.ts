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

import { MessageType } from '../transfer/Messages';
import { Nodes } from './nodes';
import { messageToWorker } from './worker';
import { RenderableElement } from './RenderableElement';
import { NumericBoolean } from '../utils';
import { TransferableEventSubscriptionChange } from '../transfer/TransferableEvent';
import { TransferableMutationRecord } from '../transfer/TransferableRecord';

let knownListeners: Array<(event: Event) => any> = [];

const eventHandler = (worker: Worker) => (event: Event): void => {
  messageToWorker(worker, {
    type: MessageType.EVENT,
    event: {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      cancelBubble: event.cancelBubble,
      currentTarget: {
        _index_: (event.currentTarget as RenderableElement)._index_,
        transferred: NumericBoolean.TRUE,
      },
      defaultPrevented: event.defaultPrevented,
      eventPhase: event.eventPhase,
      isTrusted: event.isTrusted,
      returnValue: event.returnValue,
      target: {
        _index_: (event.target as RenderableElement)._index_,
        transferred: NumericBoolean.TRUE,
      },
      timeStamp: event.timeStamp,
      type: event.type,
      scoped: event.scoped,
    },
  });
};

export function process(nodesInstance: Nodes, worker: Worker, mutation: TransferableMutationRecord): void {
  let events: TransferableEventSubscriptionChange[] | null;
  if ((events = mutation.removedEvents)) {
    events.forEach(listener =>
      (nodesInstance.getNode(mutation.target._index_) as EventTarget).removeEventListener(listener.type, knownListeners[listener.index]),
    );
  }
  if ((events = mutation.addedEvents)) {
    events.forEach(listener =>
      (nodesInstance.getNode(mutation.target._index_) as EventTarget).addEventListener(
        listener.type,
        (knownListeners[listener.index] = eventHandler(worker)),
      ),
    );
  }
}
