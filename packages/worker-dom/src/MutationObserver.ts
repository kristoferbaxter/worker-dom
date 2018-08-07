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

import { Node } from './dom/Node';
import { MutationRecord } from './MutationRecord';
import '@ampproject/worker-dom-transport/'
import { MutationRecordType } from '@ampproject/worker-dom-transport/src/TransferrableRecord';

const observers: MutationObserver[] = [];
let pendingMutations = false;

const match = (observerTarget: Node | null, target: Node | null): boolean => observerTarget !== null && target !== null && target._index_ === observerTarget._index_;
const pushMutation = (observer: MutationObserver, record: MutationRecord): void => {
  observer.pushRecord(record);
  if (!pendingMutations) {
    pendingMutations = true;
    Promise.resolve().then((): void => {
      pendingMutations = false;
      observers.forEach(observer => observer.callback(observer.takeRecords()));
    });
  }
};

/**
 * When DOM mutations occur, Nodes will call this method with MutationRecords
 * These records are then pushed into MutationObserver instances that match the MutationRecord.target
 * @param record MutationRecord to push into MutationObservers.
 */
export function mutate(record: MutationRecord): void {
  observers.forEach(observer => {
    if (record.type === MutationRecordType.COMMAND) {
      pushMutation(observer, record);
      return;
    }

    let target: Node | null = record.target;
    let matched = match(observer.target, target);
    if (!matched) {
      do {
        if ((matched = match(observer.target, target))) {
          break;
        }
      } while ((target = target && target.parentNode));
    }

    if (matched) {
      pushMutation(observer, record);
    }
  });
}

export class MutationObserver {
  public callback: (mutations: MutationRecord[]) => any;
  private _records_: MutationRecord[] = [];
  public target: Node | null;

  constructor(callback: (mutations: MutationRecord[]) => any) {
    this.callback = callback;
  }

  /**
   * Register the MutationObserver instance to observe a Nodes mutations.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   * @param target Node to observe DOM mutations
   */
  public observe(target: Node): void {
    this.disconnect();
    this.target = target;

    observers.push(this);
  }

  /**
   * Stop the MutationObserver instance from observing a Nodes mutations.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   */
  public disconnect(): void {
    this.target = null;

    const index = observers.indexOf(this);
    if (index >= 0) {
      observers.splice(index, 1);
    }
  }

  /**
   * Empties the MutationObserver instance's record queue and returns what was in there.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   * @return Mutation Records stored on this MutationObserver instance.
   */
  public takeRecords(): MutationRecord[] {
    return this._records_.splice(0, this._records_.length);
  }

  /**
   * NOTE: This method doesn't exist on native MutationObserver.
   * @param record MutationRecord to store for this instance.
   */
  public pushRecord(record: MutationRecord): void {
    this._records_.push(record);
  }
}
