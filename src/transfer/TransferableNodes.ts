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
import { Node } from '../worker-thread/dom/Node';
import { Opcode } from './Opcode';

// Both Text and Element implement a method named `serialize(transferable: Transferable)`
// When they add a NODE or TRANSFERRED_NODE to the stack for transmission they must follow
// the format specified, the encoder and decoder cannot diverge in this definition.

// TODO(KB): There must be a way to enforce this format with TypeScript.

export const serializeNodes = (transferable: Transferable, nodes: Array<Node> | undefined, opcode?: Opcode) => {
  if (nodes && nodes.length > 0) {
    nodes.forEach(node => {
      transferable.appendOpcode(opcode);
      node.serialize(transferable);
    });
  }
};

/**
 * Node ArrayBuffer Representation
 * [
 *   Opcode.NODE,
 *   index,
 *   nodeType
 *
 *   Opcode.NODE_NAME,
 *   Transferable.string(nodeName),
 *
 *   Opcode.NAMESPACE_URI
 *   Transferable.string(namespaceURI)
 *
 *   ...[Opcode.ATTRIBUTE, Transferable.string(attribute.namespaceURI || 'null), Transferable.string(attribute.name), Transferable.string(attribute.value)]
 *
 *   ...[Opcode.PROPERTY, Transferable.string(key), Transferable.string(value)]
 *
 *   ...[Opcode.CHILD_NODE, Node | TransferredNode]
 *
 *   Opcode.TEXT_CONTENT,
 *   Transferable.string(node.nodeValue)
 *
 *   Opcode.END_NODE
 * ]
 */

/**
 * TransferredNode ArrayBuffer Representation
 * [
 *   Opcode.TRANSFERRED_NODE
 *   index
 * ]
 */
