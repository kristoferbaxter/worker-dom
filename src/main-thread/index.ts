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

// Supplied by Babel Transpilation
// See: config/rollup.config.js
declare var __WORKER_DOM_URL__: string;

export function upgradeElement(baseElement: Element): void {
  const authorURL = baseElement.getAttribute('src');
  if (authorURL === null) {
    return;
  }

  const nodesInstance = new Nodes(baseElement);
  const hydrationInstance = new Hydration(baseElement, nodesInstance);
  const mutationInstance = new Mutation(nodesInstance);

  console.log(`creating worker, dom: ${__WORKER_DOM_URL__}, author code: ${authorURL}`);
  createWorker(__WORKER_DOM_URL__, authorURL).then(worker => {
    if (worker === null) {
      return;
    }

    worker.onmessage = ({ data }: MessageFromWorker) => {
      switch (data.type) {
        case MessageType.HYDRATE:
          console.info(`from worker: ${data.type}`, data.mutations);
          hydrationInstance.hydrate(data.mutations);
          break;
        case MessageType.MUTATE:
          console.info(`from worker: ${data.type}`, data.mutations);
          mutationInstance.process(data.mutations);
          break;
      }
    };
  });
}

/*
return createWorker(this.element.getAttribute('src')).then(worker => {
      const authorBaseElement = this.element.querySelector('[amp-aot]');
      const nodesInstance = new Nodes(authorBaseElement);
      const eventsInstance = new Events(authorBaseElement, worker);
      const hydrationInstance = new Hydration(authorBaseElement, nodesInstance);
      const mutationInstance = new Mutation(nodesInstance);

      worker.onmessage = ({data}: MessageEventFromWorker) => {
        switch(data.type) {
          case 'mutate':
            console.info(`from worker: ${data.type}`, data.mutations);
            mutationInstance.process(eventsInstance.lastUserGesture, data.mutations);
            break;
          case 'hydrate':
            console.info(`from worker: ${data.type}`, data.mutations);
            hydrationInstance.hydrate(data.mutations);
            break;
        }
      };

      messageToWorker(worker, {
        type: 'init',
        location: location.href,
      });
    });
*/
