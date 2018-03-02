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

import {Event} from './Event';
import {toLower, splice} from './utils';

export const enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  ENTITY_NODE = 6,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
  NOTATION_NODE = 12,
}

// TODO – KB, This is overly generic.
type EventHandler = (event: Event) => any;
interface EventHandlers {
  [index: string]: EventHandler[];
}

// https://developer.mozilla.org/en-US/docs/Web/API/Node
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
//
// Please note, in this implmentation Node doesn't extend EventTarget.
// This is intentional to reduce the number of classes.

export class Node {
  public parentNode: Node = null;
  private _handlers_: EventHandlers = {};

  public addEventListener(type: string, handler: EventHandler): void {
    this._handlers_[toLower(type)] || (this._handlers_[toLower(type)] = []).push(handler);
  }
  public removeEventListener(type: string, handler: EventHandler): void {
    splice(this._handlers_[toLower(type)], handler, 0, true);
  }
  public dispatchEvent(event: Event): boolean {
    let target: Node = (event.currentTarget = this);
    let handlers: EventHandler[];
    let iterator: number;

    do {
      handlers = target._handlers_ && target._handlers_[toLower(event.type)];
      if (handlers) {
        for (iterator = handlers.length; iterator--;) {
          if ((handlers[iterator].call(target, event) === false || event._end) && event.cancelable) {
            break;
          }
        }
      }
    } while (event.bubbles && !(event.cancelable && event._stop) && (event.target = target = target.parentNode));
    return !event.defaultPrevented;
  }
}
