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

import { TransferrableEvent } from './TransferrableEvent';
import { TransferrableMutationRecord } from './TransferrableMutationRecord';

export const enum MessageType {
  // INIT = 0,
  EVENT = 1,
  HYDRATE = 2,
  MUTATE = 3,
  // NAVIGATION_PUSH_STATE = 4,
  // NAVIGATION_REPLACE_STATE = 5,
  // NAVIGATION_POP_STATE = 6,
}

export interface MutationFromWorker {
  type: MessageType.HYDRATE | MessageType.MUTATE;
  mutations: TransferrableMutationRecord[];
}

interface EventToWorker {
  type: MessageType.EVENT;
  event: TransferrableEvent;
}
export type MessageToWorker = EventToWorker;
