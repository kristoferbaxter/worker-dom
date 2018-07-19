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
import { TransferableMutationRecord } from '../transfer/TransferableRecord';

const knownListeners: Array<(event: Event) => any> = [];

/**
 * Instead of a whitelist of elements that need their value tracked, use the existence
 * of a property called value to drive the decision.
 * @param node node to check if values should be tracked.
 * @return boolean if the node should have its value property tracked.
 */
const shouldTrackChanges = (node: HTMLElement): boolean => node && 'value' in node;

/**
 * When a node that has a value needing synced doesn't already have an event listener
 * listening for changed values, ensure the value is synced with a default listener.
 * @param worker whom to dispatch value toward.
 * @param node node to listen to value changes on.
 */
export const applyDefaultChangeListener = (worker: Worker, node: RenderableElement): void => {
  shouldTrackChanges(node as HTMLElement) && node.onchange === null && (node.onchange = fireValueChange(worker, node));
};

/**
 * Register an event handler for dispatching events to worker thread
 * @param worker whom to dispatch events toward
 * @param _index_ node index the event comes from (used to dispatchEvent in worker thread).
 * @return eventHandler function consuming event and dispatching to worker thread
 */
const eventHandler = (worker: Worker, _index_: number) => (event: Event): void => {
  if (shouldTrackChanges(event.currentTarget as HTMLElement)) {
    fireValueChange(worker, event.currentTarget as RenderableElement);
  }
  messageToWorker(worker, {
    type: MessageType.EVENT,
    event: {
      _index_,
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

/**
 * Tell the worker DOM what the value is for a Node.
 * @param worker whom to dispatch value toward.
 * @param node where to get the value from.
 */
const fireValueChange = (worker: Worker, node: RenderableElement): void => {
  messageToWorker(worker, {
    type: MessageType.SYNC,
    sync: {
      _index_: node._index_,
      value: node.value,
    },
  });
};

/**
 * Process commands transfered from worker thread to main thread.
 * @param nodesInstance nodes instance to execute commands against.
 * @param worker whom to dispatch events toward.
 * @param mutation mutation record containing commands to execute.
 */
export function process(nodesInstance: Nodes, worker: Worker, mutation: TransferableMutationRecord): void {
  const index: number = mutation.target._index_;
  const target = nodesInstance.getNode(index) as HTMLElement;
  const shouldTrack: boolean = shouldTrackChanges(target);
  let changeEventSubscribed: boolean = target.onchange !== null;

  (mutation.removedEvents || []).forEach(eventSub => {
    if (eventSub.type === 'change') {
      changeEventSubscribed = false;
    }
    target.removeEventListener(eventSub.type, knownListeners[eventSub.index]);
  });
  (mutation.addedEvents || []).forEach(eventSub => {
    if (eventSub.type === 'change') {
      changeEventSubscribed = true;
      target.onchange = null;
    }
    target.addEventListener(eventSub.type, (knownListeners[eventSub.index] = eventHandler(worker, index)));
  });
  if (shouldTrack && !changeEventSubscribed) {
    applyDefaultChangeListener(worker, target as RenderableElement);
  }
}
