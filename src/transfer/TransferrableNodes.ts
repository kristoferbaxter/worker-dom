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

import { NodeType, NodeName } from '../worker-thread/dom/Node';
import { NumericBoolean } from '../utils';
import { TransferrableKeys } from './TransferrableKeys';

export interface HydrateableNode extends TransferrableNode {
  readonly [TransferrableKeys.attributes]?: Array<{ [key: string]: string }>;
  readonly [TransferrableKeys.childNodes]?: Array<HydrateableNode>;
}

export interface TransferrableNode extends TransferredNode {
  readonly [TransferrableKeys.nodeType]: NodeType;
  readonly [TransferrableKeys.nodeName]: NodeName;

  // Optional keys that are defined at construction of a `Text` or `Element`.
  // This makes the keys observed.
  readonly [TransferrableKeys.textContent]?: string;
  readonly [TransferrableKeys.namespaceURI]?: string;
}

// If a Node has been transferred once already to main thread then we need only pass its index.
export interface TransferredNode {
  readonly [TransferrableKeys._index_]: number;
  readonly [TransferrableKeys.transferred]: NumericBoolean;
}
