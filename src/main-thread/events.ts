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

// import { messageToWorker } from './worker';
// import { TransferrableEvent } from '../transfer/TransferrableEvent';
// import { MessageType } from '../transfer/Messages';

// const EVENTS_TO_PROXY = ['change', 'click', 'focus', 'blur', 'keydown', 'input', 'dblclick'];

// export class Events {
//   worker: Worker;
//   public lastUserGesture: number;

//   constructor(baseElement: Element, worker: Worker) {
//     this.worker = worker;

//     EVENTS_TO_PROXY.forEach(event => {
//       baseElement.addEventListener(event, this.proxyEvent, { capture: true, passive: true });
//     });
//   }

//   /*
//    * This filters too much data the background thread needs to know about the event.
//    */

//   /**
//    * Forward a DOM Event into the Worker as a message
//    */
//   proxyEvent = (event: RenderableElementEvent): void => {
//     this.lastUserGesture = performance.now() || Date.now();

//     // const transferrableEvent: TransferrableEvent = Object.assign(Object.keys(event).filter(key => {
//     //   const typeOfKey = typeof key;
//     //   return typeOfKey !== 'object' && typeOfKey !== 'function' && key !== key.toUpperCase() && !event.hasOwnProperty(key)
//     // }).reduce((object, key) => {
//     //   object[key] = event[key];
//     //   return object;
//     // }, ({} as TransferrableEvent)), {
//     //   type: event.type,
//     //   target: {
//     //     __id: event.target.__id,
//     //     __value: event.target.value || null,
//     //   },
//     // });

//     // const transferrableEvent = {
//     //   ...event,
//     //   target: {
//     //     __id: event.target.__id,
//     //     __value: event.target.value || null,
//     //   },
//     //   currentTarget: {
//     //     __id: event.currentTarget.__id,
//     //     __value: event.currentTarget.value || null,
//     //   }
//     // };

//     let transferrableEvent: TransferrableEvent = {
//       type: event.type,
//       target: {
//         _index_: event.target._index_,
//         _value_: event.target.value || null,
//       },
//       currentTarget: {
//         _index_: event.currentTarget._index_,
//         _value_: event.currentTarget.value || null,
//       },
//     };

//     // Copy properties from `e` to proxied `event`.
//     for (let iterator in event) {
//       let value = event[iterator];
//       const typeOfValue = typeof value;
//       if (typeOfValue !== 'object' && typeOfValue !== 'function' && iterator !== iterator.toUpperCase() && !event.hasOwnProperty(iterator)) {
//         transferrableEvent[iterator] = value;
//       }
//     }

//     // console.log('forwarding event to worker', event, transferrableEvent);
//     messageToWorker(this.worker, { type: MessageType.EVENT, event: transferrableEvent });
//   }
// }
