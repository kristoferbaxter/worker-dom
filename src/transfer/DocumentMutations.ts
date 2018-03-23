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

import { Document } from '../Document';
import { MutationRecord } from '../MutationRecord';
import { TransferrableMutationRecord } from './TransferrableMutationRecord';
import { Node } from '../Node';
import { TransferrableNode, SubsequentTransferNode } from './TransferrableNode';

const sanitizeNodes = (nodes: Node[] | undefined): Array<TransferrableNode | SubsequentTransferNode> | null => (nodes && nodes.map(node => node._sanitize_())) || null;

function handleMutations(mutations: MutationRecord[]): void {
  mutations.forEach(mutation => {
    const transferrableMutationRecord: TransferrableMutationRecord = {
      target: mutation.target._sanitize_(),
      addedNodes: sanitizeNodes(mutation.addedNodes),
      removedNodes: sanitizeNodes(mutation.removedNodes),
      previousSibling: (mutation.previousSibling && mutation.previousSibling._sanitize_()) || null,
      nextSibling: (mutation.nextSibling && mutation.nextSibling._sanitize_()) || null,
      attributeName: mutation.attributeName || null,
      attributeNamespace: mutation.attributeNamespace || null,
      oldValue: mutation.oldValue || null,
      type: mutation.type,
      propertyName: mutation.propertyName || null,
      value: mutation.value || null,
    };
    console.info(`mutation`, transferrableMutationRecord);
  });
}

export function observe(document: Document): void {
  new document.defaultView.MutationObserver(handleMutations).observe(document.body);
}

/*
readonly removedNodes: Array<TransferrableNode | SubsequentTransferNode>;
readonly previousSibling: TransferrableNode | SubsequentTransferNode | null;
readonly nextSibling: TransferrableNode | SubsequentTransferNode | null;
readonly attributeName: string | null;
readonly attributeNamespace: string | null;
readonly oldValue: string | null;

readonly type: MutationRecordType;
readonly propertyName: string | null;
readonly value: string | null;
*/
