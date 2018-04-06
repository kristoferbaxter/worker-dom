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
import { TransferrableNode, SubsequentTransferNode } from './TransferrableNode';

// The TransferrableMutationRecord interface is modification and extension of
// the real MutationRecord, with changes to support the transferring of
// Mutations across threads and for properties (not currently supported by MutationRecord).

// For more info on MutationRecords: https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
export interface TransferrableMutationRecord {
  readonly target: TransferrableNode | SubsequentTransferNode;
  readonly addedNodes: Array<TransferrableNode | SubsequentTransferNode> | null;
  readonly removedNodes: Array<TransferrableNode | SubsequentTransferNode> | null;
  readonly previousSibling: TransferrableNode | SubsequentTransferNode | null;
  readonly nextSibling: TransferrableNode | SubsequentTransferNode | null;
  readonly attributeName: string | null;
  readonly attributeNamespace: string | null;
  readonly oldValue: string | null;

  readonly type: MutationRecordType;
  readonly propertyName: string | null;
  readonly value: string | null;
}
