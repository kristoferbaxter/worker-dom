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

import { Node } from './Node';
import { MutationRecord } from './MutationRecord';

let observers: MutationObserver[] = [];
let pendingMutations = false;

const match = (observerTarget: Node | null, target: Node): boolean => observerTarget !== null && target._index_ === observerTarget._index_;
const flushMutations = (): void => {
  pendingMutations = false;
  observers.forEach(observer => observer.callback(observer.takeRecords()));
};

export function mutate(record: MutationRecord): void {
  observers.forEach(observer => {
    let target: Node | null = record.target;
    let matched = match(observer.target, target);
    if (!matched) {
      do {
        if ((matched = match(observer.target, target))) {
          break;
        }
      } while ((target = target.parentNode));
    }

    if (matched) {
      observer.pushRecord(record);
      if (!pendingMutations) {
        pendingMutations = true;
        Promise.resolve().then(flushMutations);
      }
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

  public observe(target: Node): void {
    this.disconnect();
    this.target = target;

    observers.push(this);
  }

  public disconnect(): void {
    this.target = null;

    const index = observers.indexOf(this);
    if (index >= 0) {
      observers.splice(index, 1);
    }
  }

  public takeRecords(): MutationRecord[] {
    return this._records_.splice(0, this._records_.length);
  }

  public pushRecord(record: MutationRecord): void {
    this._records_.push(record);
  }
}
