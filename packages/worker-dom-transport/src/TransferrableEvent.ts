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

import { TransferredNode } from './TransferrableNodes';
import { TransferrableKeys } from './TransferrableKeys';

type TransferrableTarget = TransferredNode;

export interface TransferrableEvent {
  readonly [TransferrableKeys._index_]: number;
  readonly [TransferrableKeys.bubbles]?: boolean;
  readonly [TransferrableKeys.cancelable]?: boolean;
  [TransferrableKeys.cancelBubble]?: boolean;
  readonly [TransferrableKeys.currentTarget]?: TransferrableTarget;
  readonly [TransferrableKeys.defaultPrevented]?: boolean;
  readonly [TransferrableKeys.eventPhase]?: number;
  readonly [TransferrableKeys.isTrusted]?: boolean;
  [TransferrableKeys.returnValue]?: boolean;
  // readonly srcElement: TransferrableTarget | null;
  readonly [TransferrableKeys.target]?: TransferrableTarget | null;
  readonly [TransferrableKeys.timeStamp]?: number;
  readonly [TransferrableKeys.type]: string;
  readonly [TransferrableKeys.scoped]?: boolean;
}

export interface TransferrableEventSubscriptionChange {
  readonly [TransferrableKeys.type]: string;
  readonly [TransferrableKeys.index]: number;
}
