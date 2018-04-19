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

import { TransferableEvent } from './TransferableEvent';
import { TransferableMutationRecord } from './TransferableRecord';

export const enum MessageType {
  // INIT = 0,
  EVENT = 1,
  HYDRATE = 2,
  MUTATE = 3,
  COMMAND = 4,
  // NAVIGATION_PUSH_STATE = 5,
  // NAVIGATION_REPLACE_STATE = 6,
  // NAVIGATION_POP_STATE = 7,
}

export interface MutationFromWorker {
  type: MessageType.HYDRATE | MessageType.MUTATE;
  mutations: TransferableMutationRecord[];
}
export interface MessageFromWorker {
  data: MutationFromWorker;
}

interface EventToWorker {
  type: MessageType.EVENT;
  event: TransferableEvent;
}
export type MessageToWorker = EventToWorker;
