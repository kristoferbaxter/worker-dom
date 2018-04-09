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
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableNode } from '../transfer/TransferrableNode';

// TODO(KB): Restore mutation threshold timeout.
// const GESTURE_TO_MUTATION_THRESHOLD = 5000;

const Mutators: {
  [key: string]: (nodesInstance: Nodes, mutation: TransferrableMutationRecord) => void;
} = {
  childList(nodesInstance: Nodes, { target, removedNodes, addedNodes, nextSibling }: TransferrableMutationRecord): void {
    const parent = nodesInstance.getNode(target._index_);

    if (removedNodes) {
      let iterator = removedNodes.length;
      for (; iterator--; ) {
        parent.removeChild(nodesInstance.getNode(removedNodes[iterator]._index_));
      }
    }

    if (addedNodes) {
      let iterator = 0;
      const length = addedNodes.length;

      for (; iterator < length; iterator++) {
        parent.insertBefore(
          nodesInstance.getNode(addedNodes[iterator]._index_) || nodesInstance.createNode(addedNodes[iterator] as TransferrableNode),
          (nextSibling && nodesInstance.getNode(nextSibling._index_)) || null,
        );
      }
    }
  },
  attributes(nodesInstance: Nodes, { target, attributeName, value }: TransferrableMutationRecord): void {
    if (attributeName !== null && value !== null) {
      nodesInstance.getNode(target._index_).setAttribute(attributeName, value);
    }
  },
  characterData(nodesInstance: Nodes, { target, value }: TransferrableMutationRecord): void {
    if (value !== null) {
      nodesInstance.getNode(target._index_).textContent = value;
    }
  },
  properties(nodesInstance: Nodes, { target, propertyName, value }: TransferrableMutationRecord): void {
    if (propertyName !== null && value !== null) {
      nodesInstance.getNode(target._index_)[propertyName] = value;
    }
  },
};

export class Mutation {
  private MUTATION_QUEUE: TransferrableMutationRecord[] = [];
  private pendingMutations: boolean = false;
  // private lastGestureTime: number;
  private nodesInstance: Nodes;

  constructor(nodesInstance: Nodes) {
    this.nodesInstance = nodesInstance;

    this.process = this.process.bind(this);
    this.syncFlush = this.syncFlush.bind(this);
  }

  public process(mutations: TransferrableMutationRecord[]): void {
    // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferrableMutationRecord[])
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

  private syncFlush(): void {
    this.MUTATION_QUEUE.forEach(mutation => Mutators[mutation.type](this.nodesInstance, mutation));

    this.MUTATION_QUEUE.splice(0, this.MUTATION_QUEUE.length);
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
  //     Mutators[mutation.type](this.nodesInstance, mutation);
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
