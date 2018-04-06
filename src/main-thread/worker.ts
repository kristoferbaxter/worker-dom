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

import { MessageToWorker } from '../transfer/Messages';

export function createWorker(workerScriptURL: string, authorScriptURL: string): Promise<Worker | null> {
  return Promise.all([fetch(workerScriptURL).then(response => response.text()), fetch(authorScriptURL).then(response => response.text())])
    .then(([workerScript, authorScript]) => {
      // TODO(KB): Minify this output during build process.
      const code = `
        ${workerScript}
        (function() {
          var self = this;
          var document = this.document;
          var localStorage = this.localStorage;
          var location = this.location;
          var Node = this.Node;
          var Text = this.Text;
          var Element = this.Element;
          var SVGElement = this.SVGElement;
          var Document = this.Document;
          var Event = this.Event;
          var MutationObserver = this.MutationObserver;

          function addEventListener(type, handler) {
            return document.addEventListener(type, handler);
          }

          try { console.assert(!WorkerGlobalScope); } catch (e) {
            console.assert(e.message == 'WorkerGlobalScope is not defined');
          }
          try { console.assert(!DedicatedWorkerGlobalScope); } catch (e) {
            console.assert(e.message == 'DedicatedWorkerGlobalScope is not defined');
          }
          try { console.assert(!XmlHttpRequest); } catch (e) {
            console.assert(e.message == 'XmlHttpRequest is not defined');
          }
          ${authorScript}
        }).call(monkeyScope);`;
      return new Worker(URL.createObjectURL(new Blob([code])));
    })
    .catch(error => {
      return null;
    });
}

export function messageToWorker(worker: Worker, message: MessageToWorker) {
  worker.postMessage(message);
}
