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

import { MessageToWorker, MessageType } from './Messages';
import { get } from '../worker-thread/NodeMapping';
import { Event } from '../worker-thread/Event';
import { Transferable } from './Transferable';
import { Opcode } from './Opcode';
import { EventSubscriptionChange } from '../worker-thread/MutationRecord';

/**
 * Event ArrayBuffer Representation
 * ...[
 *   Opcode.ADDED_EVENT/REMOVED_EVENT
 *   ...[Transferable.string(type), index]
 * ]
 */
export const serializeEventSubscription = (transferable: Transferable, type: Opcode, subscriptions: Array<EventSubscriptionChange>) => {
  subscriptions.forEach(subscription => {
    transferable.appendString(subscription.type, type);
    transferable.appendNumber(subscription.index);
  });
};

type TransferredNodeIndex = number;

export interface TransferredEventFromMainThread {
  readonly _index_: number;
  readonly bubbles?: boolean;
  readonly cancelable?: boolean;
  cancelBubble?: boolean;
  readonly currentTarget?: TransferredNodeIndex;
  readonly defaultPrevented?: boolean;
  readonly eventPhase?: number;
  readonly isTrusted?: boolean;
  returnValue?: boolean;
  // readonly srcElement: TransferableTarget | null;
  readonly target?: TransferredNodeIndex | null;
  readonly timeStamp?: number;
  readonly type: string;
  readonly scoped?: boolean;
}

/**
 * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
 * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
 * method to dispatch the transfered event in the worker thread.
 */
export function propagate(): void {
  if (typeof addEventListener !== 'undefined') {
    addEventListener('message', ({ data }: { data: MessageToWorker }) => {
      if (data.type !== MessageType.EVENT) {
        return;
      }

      const event = data.event;
      const node = get(event._index_);
      if (node !== null) {
        node.dispatchEvent(
          Object.assign(new Event(event.type, { bubbles: event.bubbles, cancelable: event.cancelable }), {
            cancelBubble: event.cancelBubble,
            defaultPrevented: event.defaultPrevented,
            eventPhase: event.eventPhase,
            isTrusted: event.isTrusted,
            returnValue: event.returnValue,
            target: get(event.target ? event.target : null),
            timeStamp: event.timeStamp,
            scoped: event.scoped,
          }),
        );
      }
    });
  }
}
