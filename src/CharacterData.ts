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

import { Node, NodeName, NodeType } from './Node';

// @see https://developer.mozilla.org/en-US/docs/Web/API/CharacterData
export abstract class CharacterData extends Node {
  data: string;

  constructor(data: string, nodeType: NodeType, nodeName: NodeName) {
    super(nodeType, nodeName);
    this.data = data;
  }

  // Unimplemented Methods
  // NonDocumentTypeChildNode.nextElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling
  // NonDocumentTypeChildNode.previousElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling
  // CharacterData.appendData()
  // CharacterData.deleteData()
  // CharacterData.insertData()
  // CharacterData.replaceData()
  // CharacterData.substringData()

  /**
   * @return Returns the size of the string contained in CharacterData.data
   */
  get length(): number {
    return this.data.length;
  }

  /**
   * @return Returns the string contained in CharacterData.data
   */
  get nodeValue(): string {
    return this.data;
  }

  /**
   * @param value string value to store as CharacterData.data.
   */
  set nodeValue(value: string) {
    // TODO(KB): Restore mutation observation
    // let oldValue = this.data;
    this.data = value;

    // TODO(KB): Restore mutation observation
    // this.mutate(this, 'characterData', { value, oldValue });
  }
}
