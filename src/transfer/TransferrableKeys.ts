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

export const enum TransferrableKeys {
  nodeType = 0,
  nodeName = 1,
  attributes = 2,
  properties = 3,
  childNodes = 4,
  textContent = 5,
  namespaceURI = 6,
  _index_ = 7,
  transferred = 8,
  type = 9,
  target = 10,
  addedNodes = 11,
  removedNodes = 12,
  previousSibling = 13,
  nextSibling = 14,
  attributeName = 15,
  attributeNamespace = 16,
  propertyName = 17,
  value = 18,
  oldValue = 19,
  addedEvents = 20,
  removedEvents = 21,
  bubbles = 22,
  cancelable = 23,
  cancelBubble = 24,
  currentTarget = 25,
  defaultPrevented = 26,
  eventPhase = 27,
  isTrusted = 28,
  returnValue = 29,
  timeStamp = 30,
  scoped = 31,
  keyCode = 32,
  index = 33,
  mutations = 34,
  data = 35,
  event = 36,
  sync = 37,
}

// Copy of TransferrableKeys using strings as values for debugging.
// export const enum TransferrableKeys {
//   nodeType = 'nodeType',
//   nodeName = 'nodeName',
//   attributes = 'attributes',
//   properties = 'properties',
//   childNodes = 'childNodes',
//   textContent = 'textContent',
//   namespaceURI = 'namespaceURI',
//   _index_ = '_index_',
//   transferred = 'transferred',
//   type = 'type',
//   target = 'target',
//   addedNodes = 'addedNodes',
//   removedNodes = 'removedNodes',
//   previousSibling = 'previousSibling',
//   nextSibling = 'nextSibling',
//   attributeName = 'attributeName',
//   attributeNamespace = 'attributeNamespace',
//   propertyName = 'propertyName',
//   value = 'value',
//   oldValue = 'oldValue',
//   addedEvents = 'addedEvents',
//   removedEvents = 'removedEvents',
//   bubbles = 'bubbles',
//   cancelable = 'cancelable',
//   cancelBubble = 'cancelBubble',
//   currentTarget = 'currentTarget',
//   defaultPrevented = 'defaultPrevented',
//   eventPhase = 'eventPhase',
//   isTrusted = 'isTrusted',
//   returnValue = 'returnValue',
//   timeStamp = 'timeStamp',
//   scoped = 'scoped',
//   keyCode = 'keyCode',
//   index = 'index',
//   mutations = 'mutations',
//   data = 'data',
//   event = 'event',
//   sync = 'sync',
// }
