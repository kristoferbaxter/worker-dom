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

import { MutationRecordType } from '../worker-thread/MutationRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableNode } from '../transfer/TransferrableNodes';
import { getNode, createNode } from 'nodes
import { process } from 'command

// TODO(KB): Restore mutation threshold timeout.
// const GESTURE_TO_MUTATION_THRESHOLD = 5000;

let MUTATION_QUEUE: TransferrableMutationRecord[] = [];
let PENDING_MUTATIONS: boolean = false;
let worker: Worker;

export function prepareMutate(passedWorker: Worker): void {
  worker = passedWorker;
}

const mutators: {
  [key: number]: (mutation: TransferrableMutationRecord, sanitizer?: Sanitizer) => void;
} = {
  [MutationRecordType.CHILD_LIST](mutation: TransferrableMutationRecord, sanitizer: Sanitizer) {
    const parent = getNode(mutation[TransferrableKeys.target][TransferrableKeys._index_]);

    const removedNodes = mutation[TransferrableKeys.removedNodes];
    if (removedNodes) {
      removedNodes.forEach(node => parent.removeChild(getNode(node[TransferrableKeys._index_])));
    }

    const addedNodes = mutation[TransferrableKeys.addedNodes];
    const nextSibling = mutation[TransferrableKeys.nextSibling];
    if (addedNodes) {
      addedNodes.forEach(node => {
        let newChild = getNode(node[TransferrableKeys._index_]);
        if (!newChild) {
          newChild = createNode(node as TransferrableNode);
          if (sanitizer) {
            sanitizer.sanitize(newChild); // TODO(choumx): Inform worker?
          }
        }
        parent.insertBefore(newChild, (nextSibling && getNode(nextSibling[TransferrableKeys._index_])) || null);
      });
    }
  },
  [MutationRecordType.ATTRIBUTES](mutation: TransferrableMutationRecord, sanitizer?: Sanitizer) {
    const attributeName = mutation[TransferrableKeys.attributeName];
    const value = mutation[TransferrableKeys.value];
    if (attributeName != null && value != null) {
      const node = getNode(mutation[TransferrableKeys.target][TransferrableKeys._index_]);
      if (!sanitizer || sanitizer.validAttribute(node.nodeName, attributeName, value)) {
        node.setAttribute(attributeName, value);
      } else {
        // TODO(choumx): Inform worker?
      }
    }
  },
  [MutationRecordType.CHARACTER_DATA](mutation: TransferrableMutationRecord, sanitizer?: Sanitizer) {
    const value = mutation[TransferrableKeys.value];
    if (value) {
      // Sanitization not necessary for textContent.
      getNode(mutation[TransferrableKeys.target][TransferrableKeys._index_]).textContent = value;
    }
  },
  [MutationRecordType.PROPERTIES](mutation: TransferrableMutationRecord, sanitizer?: Sanitizer) {
    const propertyName = mutation[TransferrableKeys.propertyName];
    const value = mutation[TransferrableKeys.value];
    if (propertyName && value) {
      const node = getNode(mutation[TransferrableKeys.target][TransferrableKeys._index_]);
      if (!sanitizer || sanitizer.validProperty(node.nodeName, propertyName, value)) {
        node[propertyName] = value;
      } else {
        // TODO(choumx): Inform worker?
      }
    }
  },
  [MutationRecordType.COMMAND](mutation: TransferrableMutationRecord) {
    process(worker, mutation);
  },
};

/**
 * Process MutationRecord from worker thread applying changes to the existing DOM.
 * @param hydrationFromWorker contains mutations to apply
 * @param nodes
 * @param worker
 */
export function mutate(mutations: TransferrableMutationRecord[], sanitizer?: Sanitizer): void {
  //mutations: TransferrableMutationRecord[]): void {
  // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferrableMutationRecord[])
  // if (performance.now() || Date.now() - lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
  //   return;
  // }
  // this.lastGestureTime = lastGestureTime;
  MUTATION_QUEUE = MUTATION_QUEUE.concat(mutations);
  if (!PENDING_MUTATIONS) {
    PENDING_MUTATIONS = true;
    requestAnimationFrame(() => syncFlush(sanitizer));
  }
}

/**
 * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
 * mutations to apply in a single frame.
 *
 * Investigations in using asyncFlush to resolve are worth considering.
 */
function syncFlush(sanitizer?: Sanitizer): void {
  const length = MUTATION_QUEUE.length;
  MUTATION_QUEUE.forEach(mutation => mutators[mutation[TransferrableKeys.type]](mutation, sanitizer));

  MUTATION_QUEUE.splice(0, length);
  PENDING_MUTATIONS = false;
}
