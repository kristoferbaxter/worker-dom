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

import { MutationRecordType } from '../worker-thread/MutationRecord';
import { TransferableNode, TransferredNode } from './TransferableNodes';
import { TransferableEventSubscriptionChange } from './TransferableEvent';

// The TransferableMutationRecord interface is modification and extension of
// the real MutationRecord, with changes to support the transferring of
// Mutations across threads and for properties (not currently supported by MutationRecord).

// For more info on MutationRecords: https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
export interface TransferableMutationRecord {
  [key: string]:
    | undefined
    | TransferableNode
    | TransferredNode
    | Array<TransferableNode | TransferredNode>
    | string
    | MutationRecordType
    | Array<TransferableEventSubscriptionChange>;
  target: TransferableNode | TransferredNode;
  addedNodes?: Array<TransferableNode | TransferredNode>;
  removedNodes?: Array<TransferableNode | TransferredNode>;
  previousSibling?: TransferableNode | TransferredNode;
  nextSibling?: TransferableNode | TransferredNode;
  attributeName?: string;
  attributeNamespace?: string;
  oldValue?: string;

  type: MutationRecordType;
  propertyName?: string;
  value?: string;
  addedEvents?: Array<TransferableEventSubscriptionChange>;
  removedEvents?: Array<TransferableEventSubscriptionChange>;
  measure?: Array<TransferredNode>;
}

// TODO(KB): Hydrations are not allowed to contain TransferredNodes.
// Perhaps we should create a TransferableHydrationRecord.
// export interface TransferableHydrationRecord {
//   readonly target: TransferableNode;
//   readonly addedNodes: Array<TransferableNode> | null;
//   readonly removedNodes: Array<TransferableNode> | null;
//   readonly previousSibling: TransferableNode | null;
//   readonly nextSibling: TransferableNode | null;
//   readonly attributeName: string | null;
//   readonly attributeNamespace: string | null;
//   readonly oldValue: string | null;

//   readonly type: MutationRecordType;
//   readonly propertyName: string | null;
//   readonly value: string | null;
// }
