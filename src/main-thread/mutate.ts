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

// import {getNode, createNode} from './nodes.js';
import { Nodes } from './nodes';
import { TransferableMutationRecord } from '../transfer/TransferableRecord';
import { TransferableNode } from '../transfer/TransferableNodes';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { process } from './command';

// TODO(KB): Restore mutation threshold timeout.
// const GESTURE_TO_MUTATION_THRESHOLD = 5000;

const mutators: {
  [key: number]: (nodesInstance: Nodes, worker: Worker, mutation: TransferableMutationRecord) => void;
} = {
  [MutationRecordType.CHILD_LIST]: (
    nodesInstance: Nodes,
    worker: Worker,
    { target, removedNodes, addedNodes, nextSibling }: TransferableMutationRecord,
  ) => {
    const parent = nodesInstance.getNode(target._index_);

    if (removedNodes) {
      removedNodes.forEach(node => parent.removeChild(nodesInstance.getNode(node._index_)));
    }

    if (addedNodes) {
      addedNodes.forEach(node => {
        parent.insertBefore(
          nodesInstance.getNode(node._index_) || nodesInstance.createNode(node as TransferableNode),
          (nextSibling && nodesInstance.getNode(nextSibling._index_)) || null,
        );
      });
    }
  },
  [MutationRecordType.ATTRIBUTES]: (nodesInstance: Nodes, worker: Worker, { target, attributeName, value }: TransferableMutationRecord) => {
    if (attributeName !== null && value !== null) {
      nodesInstance.getNode(target._index_).setAttribute(attributeName, value);
    }
  },
  [MutationRecordType.CHARACTER_DATA]: (nodesInstance: Nodes, worker: Worker, { target, value }: TransferableMutationRecord) => {
    if (value !== null) {
      nodesInstance.getNode(target._index_).textContent = value;
    }
  },
  [MutationRecordType.PROPERTIES]: (nodesInstance: Nodes, worker: Worker, { target, propertyName, value }: TransferableMutationRecord) => {
    if (propertyName !== null && value !== null) {
      nodesInstance.getNode(target._index_)[propertyName] = value;
    }
  },
  [MutationRecordType.COMMAND]: (nodesInstance: Nodes, worker: Worker, mutation: TransferableMutationRecord) =>
    process(nodesInstance, worker, mutation),
};

export class Mutation {
  private MUTATION_QUEUE: TransferableMutationRecord[] = [];
  private pendingMutations: boolean = false;
  // private lastGestureTime: number;
  private nodesInstance: Nodes;
  private worker: Worker;

  constructor(nodesInstance: Nodes, worker: Worker) {
    this.nodesInstance = nodesInstance;
    this.worker = worker;

    this.process = this.process.bind(this);
    this.syncFlush = this.syncFlush.bind(this);
  }

  /**
   * Process MutationRecord from worker thread applying changes to the existing DOM.
   * @param hydrationFromWorker contains mutations to apply
   */
  public process(mutations: TransferableMutationRecord[]): void {
    //mutations: TransferableMutationRecord[]): void {
    // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferableMutationRecord[])
    // if (performance.now() || Date.now() - lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
    //   return;
    // }

    // this.lastGestureTime = lastGestureTime;
    this.MUTATION_QUEUE = this.MUTATION_QUEUE.concat(mutations);
    if (!this.pendingMutations) {
      this.pendingMutations = true;
      requestAnimationFrame(this.syncFlush);
    }
  }

  /**
   * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
   * mutations to apply in a single frame.
   *
   * Investigations in using asyncFlush to resolve are worth considering.
   */
  private syncFlush(): void {
    const length = this.MUTATION_QUEUE.length;
    this.MUTATION_QUEUE.forEach(mutation => mutators[mutation.type](this.nodesInstance, this.worker, mutation));

    this.MUTATION_QUEUE.splice(0, length);
    this.pendingMutations = false;
  }

  /**
   * Alternative flushing method using rIC.
   */
  // private asyncFlush(): void {
  //   const start = performance.now();
  //   const mutationLenth = this.MUTATION_QUEUE.length;
  //   let removed = 0;

  //   for (let mutation of this.MUTATION_QUEUE) {
  //     mutators[mutation.type](this.nodesInstance, mutation);
  //     removed++;

  //     if (performance.now() - start > 1) {
  //       break;
  //     } else if (mutation.timestamp - this.lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
  //       console.warn(`Mutation latency exceeded. Queued until next gesture: ${mutation.timestamp}`);
  //       break;
  //     }
  //   }

  //   this.MUTATION_QUEUE.splice(0, removed);
  //   if (removed < mutationLenth) {
  //     requestAnimationFrame(this.asyncFlush);
  //   } else {
  //     this.pendingMutations = false;
  //   }
  // }
}
