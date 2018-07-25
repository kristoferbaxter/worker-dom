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

export const enum Opcode {
  NODE = 0,
  TRANSFERRED_NODE = 1,
  END_NODE = 2,
  NODE_NAME = 3,
  ATTRIBUTE = 4,
  PROPERTY = 5,
  TEXT_CONTENT = 6,

  MUTATION_RECORD = 10,
  END_MUTATION_RECORD = 11,
  TARGET = 12,
  PROPERTY_NAME = 13,
  NAMESPACE_URI = 14,
  ATTRIBUTE_NAME = 15,
  ATTRIBUTE_NAMESPACE = 16,
  VALUE = 17,
  OLD_VALUE = 18,
  ADD_NODE = 19,
  REMOVE_NODE = 20,
  PREVIOUS_SIBLING = 21,
  NEXT_SIBLING = 22,
  ADD_EVENT = 23,
  REMOVE_EVENT = 24,

  NULL = 30,
}

export const OPCODE_UINT8_LENGTH = 1;
