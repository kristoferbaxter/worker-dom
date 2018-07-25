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

import { Transferable } from './Transferable';
import { MutationRecord } from '../worker-thread/MutationRecord';
import { Opcode } from './Opcode';
import { serializeNodes } from './TransferableNodes';
import { serializeEventSubscription } from './TransferableEvent';

export function serializeMutation(transferable: Transferable, mutation: MutationRecord) {
  transferable.appendNumbers([mutation.type], Opcode.MUTATION_RECORD, Opcode.TARGET);
  mutation.target.serialize(transferable);
  mutation.propertyName && transferable.appendString(mutation.propertyName, Opcode.PROPERTY_NAME);
  mutation.attributeName && transferable.appendString(mutation.attributeName, Opcode.ATTRIBUTE_NAME);
  mutation.attributeNamespace && transferable.appendString(mutation.attributeNamespace, Opcode.ATTRIBUTE_NAMESPACE);
  mutation.value && transferable.appendString(mutation.value, Opcode.VALUE);
  mutation.oldValue && transferable.appendString(mutation.oldValue, Opcode.OLD_VALUE);
  serializeNodes(transferable, mutation.addedNodes, Opcode.ADD_NODE);
  serializeNodes(transferable, mutation.removedNodes, Opcode.REMOVE_NODE);
  if (mutation.previousSibling) {
    transferable.appendOpcode(Opcode.PREVIOUS_SIBLING);
    mutation.previousSibling.serialize(transferable);
  }
  if (mutation.nextSibling) {
    transferable.appendOpcode(Opcode.NEXT_SIBLING);
    mutation.nextSibling.serialize(transferable);
  }
  mutation.addedEvents && serializeEventSubscription(transferable, Opcode.ADD_EVENT, mutation.addedEvents);
  mutation.removedEvents && serializeEventSubscription(transferable, Opcode.REMOVE_EVENT, mutation.removedEvents);
}

/**
 * MutationRecord ArrayBuffer Representation
 * [
 *   Opcode.MUTATION_RECORD,
 *
 *   MutationRecordOpcode.MUTATION_TYPE,
 *   MutationRecordType,
 *
 *   MutationRecordOpcode.TARGET,
 *   Node.serialize(transferable: Transferable) <-- see TransferableNodes.ts
 *
 *   MutationRecordOpcode.PROPERTY_NAME
 *   Transferable.string(propertyName),
 *
 *   MutationRecordOpcode.ATTRIBUTE_NAME
 *   Transferable.string(attributeName),
 *
 *   MutationRecordOpcode.ATTRIBUTE_NAMESPACE
 *   Transferable.string(attributeNamespace),
 *
 *   MutationRecordOpcode.VALUE
 *   Transferable.string(value),
 *
 *   MutationRecordOpcode.OLD_VALUE
 *   Transferable.string(oldValue),
 *
 *   ...[MutationRecordOpcode.ADDED_NODE, addedNodes.serialize(transferable: Transferable)] <-- see TransferableNodes.ts
 *
 *   ...[MutationRecordOpcode.REMOVED_NODE, removedNodes.serialize(transferable: Transferable)] <-- see TransferableNodes.ts
 *
 *   MutationRecordOpcode.PREVIOUS_SIBLING
 *   previousSibling.serialize(transferable) <-- see TransferableNodes.ts
 *
 *   MutationRecordOpcode.NEXT_SIBLING
 *   nextSibling.serialize(transferable: Transferable) <-- see TransferableNodes.ts
 *
 *   ...[MutationRecordOpcode.ADD_EVENT, Event.serialize(transferable: Transferable)] <-- see serializeEventSubscription
 *
 *   MutationRecordOpcode.REMOVED_EVENTS
 *   Event.serialize(transferable: Transferable) <-- see serializeEventSubscription
 *
 *   Opcode.END_MUTATION_RECORD
 * ]
 */
