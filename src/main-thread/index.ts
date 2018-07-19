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
import { Hydration } from './hydrate';
import { Mutation } from './mutate';
import { createWorker } from './worker';
import { MessageFromWorker, MessageType } from '../transfer/Messages';

export function upgradeElement(baseElement: Element): void {
  const authorURL = baseElement.getAttribute('src');
  if (authorURL === null) {
    return;
  }

  const nodesInstance = new Nodes(baseElement);
  // The document element is constructed before the worker MutationObserver is attached.
  // As a result, we must manually store the reference node for the main thread.
  nodesInstance.storeNode(baseElement as HTMLElement, 1);
  nodesInstance.storeNode(baseElement as HTMLElement, 2);

  // console.log(`creating worker, author code: ${authorURL}`);
  createWorker(authorURL).then(worker => {
    if (worker === null) {
      return;
    }

    const hydrationInstance = new Hydration(baseElement, nodesInstance, worker);
    const mutationInstance = new Mutation(nodesInstance, worker);

    worker.onmessage = ({ data }: MessageFromWorker) => {
      switch (data.type) {
        case MessageType.HYDRATE:
          // console.info(`hydration from worker: ${data.type}`, data.mutations);
          hydrationInstance.process(data.mutations);
          break;
        case MessageType.MUTATE:
          // console.info(`mutation from worker: ${data.type}`, data.mutations);
          mutationInstance.process(data.mutations);
          break;
      }
    };
  });
}
