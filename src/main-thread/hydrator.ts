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

import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { TransferrableNode } from '../transfer/TransferrableNodes';
import { storeNode, getNode } from 'nodes';
import { RenderableElement } from 'RenderableElement';

// ** TransferrableMutationRecord Structure **
// {
//   "9": 2,       <-- type: MutationRecordType
//   "10": 3,      <-- target: number (node index)
//   "11":         <-- addedNodes: Array<TransferrableNode>
//     [
//       {
//         "0": 3,               <-- nodeType: NodeType
//         "1": "#text",         <-- nodeName: NodeName
//         "5": "Hello World!",  <-- textContent: string
//         "7": 4,               <-- _index_: number
//         "8": 0                <-- transferred: NumericBoolean
//       },
//       {
//         "0": 1,               <-- nodeType: NodeType
//         "1": "span",          <-- nodeName: NodeName
//         "2": [],              <-- attributes: Array<{[index: string]: string}>
//         "4": [6],             <-- childNodes: Array<number> (Node._index_)
//         "6": null,            <-- namespaceURI: string | null
//         "7": 5,               <-- _index_: number
//         "8": 0                <-- transferred: NumericBoolean
//       }
//     ],
// }

export function hydrate(transferredMutations: Array<TransferrableMutationRecord>, baseElement: HTMLElement, worker: Worker) {
  let commands: Array<TransferrableMutationRecord> = [];
  let mutations: Array<TransferrableMutationRecord> = [];

  // Ensure commands are processed after nodes have been created.
  transferredMutations.forEach(
    mutation => (mutation[TransferrableKeys.type] === MutationRecordType.COMMAND ? commands.push(mutation) : mutations.push(mutation)),
  );

  while (mutations.length > 0) {
    const target: RenderableElement = getNode(mutations[0][TransferrableKeys.target]);
    if (target !== undefined) {
      // This target is known, and we can process the requested mutation

      mutations.shift();
      return;
    }

    // The target is not yet known, lets move this mutation to the end of the list and try processing the next.
    if (mutations.length > 1) {
      // Only push the item if it's not the last one remaining.
      mutations.push(mutations[0]);
    }
    mutations.shift();
  }
  // mutations.forEach(mutation => {
  //   if (mutation[TransferrableKeys.type] === MutationRecordType.COMMAND) {
  //     // Ensure commands are processed after nodes have been created.
  //     commands.push(mutation);
  //     return;
  //   }

  //   const addedNodes = (mutation[TransferrableKeys.addedNodes] as Array<TransferrableNode>);
  //   if (addedNodes && addedNodes.length > 0) {
  //     if (getNode())
  //     storeNode(
  //   }

  // });
}

// readonly [TransferrableKeys.type]: MutationRecordType;
// readonly [TransferrableKeys.target]: TransferrableNode | TransferredNode;

// [TransferrableKeys.addedNodes]?: Array<TransferrableNode | TransferredNode>;
// [TransferrableKeys.removedNodes]?: Array<TransferrableNode | TransferredNode>;
// [TransferrableKeys.previousSibling]?: TransferrableNode | TransferredNode;
// [TransferrableKeys.nextSibling]?: TransferrableNode | TransferredNode;
// [TransferrableKeys.attributeName]?: string;
// [TransferrableKeys.attributeNamespace]?: string;
// [TransferrableKeys.propertyName]?: string;
// [TransferrableKeys.value]?: string;
// [TransferrableKeys.oldValue]?: string;
// [TransferrableKeys.addedEvents]?: TransferrableEventSubscriptionChange[];
// [TransferrableKeys.removedEvents]?: TransferrableEventSubscriptionChange[];

// readonly [TransferrableKeys.nodeType]: NodeType;
// readonly [TransferrableKeys.nodeName]: NodeName;
// readonly [TransferrableKeys.textContent]: string;
// readonly [TransferrableKeys.attributes]?: Array<{ [index: string]: string }>;
// readonly [TransferrableKeys.properties]?: Array<{ [index: string]: string }>;
// readonly [TransferrableKeys.childNodes]?: Array<number>;
// readonly [TransferrableKeys.namespaceURI]?: string;
