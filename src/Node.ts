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

import { Event } from "./Event";
import { toLower, splice } from "./utils";

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
  public nodeType: NodeType;
  public childNodes: Node[] = [];
  public parentNode: Node = null;
  private _handlers_: EventHandlers = {};

  constructor(nodeType: NodeType) {
    this.nodeType = nodeType;
  }

  // Properties
  get firstChild(): Node {
    return this.childNodes.length > 0 ? this.childNodes[0] : null;
  }
  get lastChild(): Node {
    return this.childNodes.length > 0 ? this.childNodes[this.childNodes.length - 1] : null;
  }

  /**
   * Adds the specified childNode argument as the last child to the current node.
   *
   * If the argument referenced an existing node on the DOM tree, the node will be detached
   * from its current position and attached at the new position.
   */
  public appendChild(child: Node): void {
    child.remove();
    child.parentNode = this;
    this.childNodes.push(child);

    // TODO – KB: Restore mutation observation.
    // this.mutate(this, 'childList', {
    //   addedNodes: [child],
    //   removedNodes: null,
    //   previousSibling: this.childNodes[this.childNodes.length - 2],
    //   nextSibling: null,
    // });
  }

  /**
   * Removes a child node from the current element, which must be a child of the current node.
   *
   * @param child child Node to remove from the parent.
   */
  public removeChild(child: Node): void {
    splice(this.childNodes, child, null, false);

    // TODO – KB: Restore mutation observation.
    // let i = splice(this.childNodes, child, null, false);
    // this.mutate(this, 'childList', {
    //   addedNodes: null,
    //   removedNodes: [child],
    //   previousSibling: this.childNodes[i - 1],
    //   nextSibling: this.childNodes[i],
    // });
  }
  public remove() {
    this.parentNode && this.parentNode.removeChild(this);
  }

  // EventTarget methods
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
        for (iterator = handlers.length; iterator--; ) {
          if ((handlers[iterator].call(target, event) === false || event._end) && event.cancelable) {
            break;
          }
        }
      }
    } while (event.bubbles && !(event.cancelable && event._stop) && (event.target = target = target.parentNode));
    return !event.defaultPrevented;
  }
}
