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

import { TransferredNode } from './TransferableNodes';
import { MessageToWorker, MessageType } from './Messages';
import { get } from '../worker-thread/NodeMapping';
import { Node } from '../worker-thread/dom/Node';
import { Event } from '../worker-thread/Event';

type TransferableTarget = TransferredNode;

export interface TransferableEvent {
  readonly _index_: number;
  readonly bubbles?: boolean;
  readonly cancelable?: boolean;
  cancelBubble?: boolean;
  readonly currentTarget?: TransferableTarget;
  readonly defaultPrevented?: boolean;
  readonly eventPhase?: number;
  readonly isTrusted?: boolean;
  returnValue?: boolean;
  // readonly srcElement: TransferableTarget | null;
  readonly target?: TransferableTarget | null;
  readonly timeStamp?: number;
  readonly type: string;
  readonly scoped?: boolean;
}

export interface TransferableEventSubscriptionChange {
  readonly type: string;
  readonly index: number;
}

/**
 * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
 * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
 * method to dispatch the transfered event in the worker thread.
 */
export function propagate(): void {
  if (typeof addEventListener !== 'undefined') {
    addEventListener('message', ({ data: { type, event } }: { data: MessageToWorker }) => {
      if (type !== MessageType.EVENT) {
        return;
      }

      const node: Node | null = get(event._index_);
      if (node) {
        node.dispatchEvent(
          Object.assign(new Event(event.type, { bubbles: event.bubbles, cancelable: event.cancelable }), {
            cancelBubble: event.cancelBubble,
            defaultPrevented: event.defaultPrevented,
            eventPhase: event.eventPhase,
            isTrusted: event.isTrusted,
            returnValue: event.returnValue,
            target: get(event.target ? event.target._index_ : null),
            timeStamp: event.timeStamp,
            scoped: event.scoped,
          }),
        );
      }
    });
  }
}
