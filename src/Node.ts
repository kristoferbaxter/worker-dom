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

import { Event } from './Event';
import { toLower, splice } from './utils';

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

  // Unimplemented Properties
  // Node.baseURI – https://developer.mozilla.org/en-US/docs/Web/API/Node/baseURI
  // Node.isConnected – https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected

  // Properties
  get firstChild(): Node {
    return this.childNodes.length > 0 ? this.childNodes[0] : null;
  }
  get lastChild(): Node {
    return this.childNodes.length > 0 ? this.childNodes[this.childNodes.length - 1] : null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling
   * @returns node immediately following the specified one in it's parent's childNodes or null if one doesn't exist.
   */
  get nextSibling(): Node {
    if (this.parentNode === null) {
      return null;
    }

    const parentChildNodes = this.parentNode.childNodes;
    return parentChildNodes[parentChildNodes.indexOf(this) + 1] || null;
  }

  /**
   * Adds the specified childNode argument as the last child to the current node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
   * @param child Child Node to append to this Node.
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
   * Removes a child node from the current element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
   * @param child Child Node to remove from this Node.
   * @returns Node removed from the tree or null if the node wasn't attached to this tree.
   */
  public removeChild(child: Node): Node {
    const index = this.childNodes.indexOf(child);

    if (index !== -1) {
      return this.childNodes.splice(index, 1)[0];
    }
    return null;

    // TODO – KB: Restore mutation obs ervation.
    // let i = splice(this.childNodes, child, null, false);
    // this.mutate(this, 'childList', {
    //   addedNodes: null,
    //   removedNodes: [child],
    //   previousSibling: this.childNodes[i - 1],
    //   nextSibling: this.childNodes[i],
    // });
  }

  /**
   * Removes this Node from the tree it belogs too.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
   */
  public remove(): void {
    this.parentNode && this.parentNode.removeChild(this);
  }

  /**
   * Add an event listener to callback when a specific event type is dispatched.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function called when event is dispatched.
   */
  public addEventListener(type: string, handler: EventHandler): void {
    this._handlers_[toLower(type)] || (this._handlers_[toLower(type)] = []).push(handler);
  }

  /**
   * Remove a registered event listener for a specific event type.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function to stop calling when event is dispatched.
   */
  public removeEventListener(type: string, handler: EventHandler): void {
    splice(this._handlers_[toLower(type)], handler, 0, true);
  }

  /**
   * Dispatch an event for this Node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
   * @param event Event to dispatch to this node and potentially cascade to parents.
   */
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
