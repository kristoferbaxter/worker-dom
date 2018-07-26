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

import { Nodes } from './nodes';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableNode } from '../transfer/TransferrableNodes';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { process } from './command';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

// TODO(KB): Restore mutation threshold timeout.
// const GESTURE_TO_MUTATION_THRESHOLD = 5000;

const mutators: {
  [key: number]: (nodesInstance: Nodes, worker: Worker, mutation: TransferrableMutationRecord) => void;
} = {
  [MutationRecordType.CHILD_LIST]: (nodesInstance: Nodes, worker: Worker, mutation: TransferrableMutationRecord) => {
    const parent = nodesInstance.getNode(mutation[TransferrableKeys.target][TransferrableKeys._index_]);

    const removedNodes = mutation[TransferrableKeys.removedNodes];
    if (removedNodes) {
      removedNodes.forEach(node => parent.removeChild(nodesInstance.getNode(node[TransferrableKeys._index_])));
    }

    const addedNodes = mutation[TransferrableKeys.addedNodes];
    const nextSibling = mutation[TransferrableKeys.nextSibling];
    if (addedNodes) {
      addedNodes.forEach(node => {
        parent.insertBefore(
          nodesInstance.getNode(node[TransferrableKeys._index_]) || nodesInstance.createNode(node as TransferrableNode),
          (nextSibling && nodesInstance.getNode(nextSibling[TransferrableKeys._index_])) || null,
        );
      });
    }
  },
  [MutationRecordType.ATTRIBUTES]: (nodesInstance: Nodes, worker: Worker, mutation: TransferrableMutationRecord) => {
    const attributeName = mutation[TransferrableKeys.attributeName];
    const value = mutation[TransferrableKeys.value];
    if (attributeName != null && value != null) {
      nodesInstance.getNode(mutation[TransferrableKeys.target][TransferrableKeys._index_]).setAttribute(attributeName, value);
    }
  },
  [MutationRecordType.CHARACTER_DATA]: (nodesInstance: Nodes, worker: Worker, mutation: TransferrableMutationRecord) => {
    const value = mutation[TransferrableKeys.value];
    if (value) {
      nodesInstance.getNode(mutation[TransferrableKeys.target][TransferrableKeys._index_]).textContent = value;
    }
  },
  [MutationRecordType.PROPERTIES]: (nodesInstance: Nodes, worker: Worker, mutation: TransferrableMutationRecord) => {
    const propertyName = mutation[TransferrableKeys.propertyName];
    const value = mutation[TransferrableKeys.value];
    if (propertyName && value) {
      nodesInstance.getNode(mutation[TransferrableKeys.target][TransferrableKeys._index_])[propertyName] = value;
    }
  },
  [MutationRecordType.COMMAND]: (nodesInstance: Nodes, worker: Worker, mutation: TransferrableMutationRecord) =>
    process(nodesInstance, worker, mutation),
};

export class Mutation {
  private MUTATION_QUEUE_: TransferrableMutationRecord[] = [];
  private pendingMutations_: boolean = false;
  // private lastGestureTime: number;
  private nodesInstance_: Nodes;
  private worker_: Worker;

  constructor(nodesInstance: Nodes, worker: Worker) {
    this.nodesInstance_ = nodesInstance;
    this.worker_ = worker;
  }

  /**
   * Process MutationRecord from worker thread applying changes to the existing DOM.
   * @param hydrationFromWorker contains mutations to apply
   */
  public process = (mutations: TransferrableMutationRecord[]): void => {
    //mutations: TransferrableMutationRecord[]): void {
    // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferrableMutationRecord[])
    // if (performance.now() || Date.now() - lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
    //   return;
    // }
    // this.lastGestureTime = lastGestureTime;
    this.MUTATION_QUEUE_ = this.MUTATION_QUEUE_.concat(mutations);
    if (!this.pendingMutations_) {
      this.pendingMutations_ = true;
      requestAnimationFrame(this.syncFlush_);
    }
  };

  /**
   * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
   * mutations to apply in a single frame.
   *
   * Investigations in using asyncFlush to resolve are worth considering.
   */
  private syncFlush_ = (): void => {
    const length = this.MUTATION_QUEUE_.length;
    this.MUTATION_QUEUE_.forEach(mutation => mutators[mutation[TransferrableKeys.type]](this.nodesInstance_, this.worker_, mutation));

    this.MUTATION_QUEUE_.splice(0, length);
    this.pendingMutations_ = false;
  };

  /**
   * Alternative flushing method using rIC.
   */
  // private asyncFlush_(): void {
  //   const start = performance.now();
  //   const mutationLenth = this.MUTATION_QUEUE_.length;
  //   let removed = 0;

  //   for (let mutation of this.MUTATION_QUEUE_) {
  //     mutators[mutation.type](this.nodesInstance_, mutation);
  //     removed++;

  //     if (performance.now() - start > 1) {
  //       break;
  //     } else if (mutation.timestamp - this.lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
  //       console.warn(`Mutation latency exceeded. Queued until next gesture: ${mutation.timestamp}`);
  //       break;
  //     }
  //   }

  //   this.MUTATION_QUEUE_.splice(0, removed);
  //   if (removed < mutationLenth) {
  //     requestAnimationFrame(this.asyncFlush);
  //   } else {
  //     this.pendingMutations_ = false;
  //   }
  // }
}
