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

import { Document } from '../worker-thread/dom/Document';
import { MutationRecord } from '../worker-thread/MutationRecord';
import { MutationFromWorker, MessageType } from './Messages';
import { Transferable } from './Transferable';
import { serializeMutation } from './TransferableRecord';

const SUPPORTS_POST_MESSAGE = typeof postMessage !== 'undefined';
const transferable = new Transferable();
let observing = false;
let hydrated = false;

function handleMutations(incomingMutations: MutationRecord[]): void {
  incomingMutations.forEach(mutation => serializeMutation(transferable, mutation));

  if (SUPPORTS_POST_MESSAGE) {
    const mutations = transferable.consume();
    const mutationFromWorker: MutationFromWorker = {
      type: hydrated ? MessageType.MUTATE : MessageType.HYDRATE,
      mutations,
    };
    hydrated = true;

    debugger;
    postMessage(mutationFromWorker, [mutations.buffer]);
  }
}

export function observe(document: Document): void {
  if (!observing) {
    new document.defaultView.MutationObserver(handleMutations).observe(document.body);
    observing = true;
  }
}
