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

import { NodeType, NodeName } from '../Node';

export interface TransferrableNode {
  readonly _index_: number;
  readonly nodeType: NodeType;
  readonly nodeName: NodeName;
  readonly attributes: Array<{
    [index: string]: string;
  }>;
  readonly properties: Array<{
    [index: string]: any;
  }>;
  readonly childNodes: Array<TransferrableNode | SubsequentTransferNode>;
  readonly textContent: string;
}

// If a Node has been transferred once already to main thread then we need only pass its index.
export interface SubsequentTransferNode {
  readonly _index_: number;
}
