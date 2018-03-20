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
import { toLower } from './utils';

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
  // Note: DOCUMENT_FRAGMENT_NODE is not supported in this implementation yet.
  NOTATION_NODE = 12,
}
type EventHandler = (event: Event) => any;
interface EventHandlers {
  [index: string]: EventHandler[];
}
export type NodeName = '#comment' | '#document' | '#document-fragment' | '#text' | string;

// https://developer.mozilla.org/en-US/docs/Web/API/Node
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
//
// Please note, in this implmentation Node doesn't extend EventTarget.
// This is intentional to reduce the number of classes.

export class Node {
  public nodeType: NodeType;
  public nodeName: NodeName;
  public childNodes: Node[] = [];
  public parentNode: Node | null = null;
  private _handlers_: EventHandlers = {};

  constructor(nodeType: NodeType, nodeName: NodeName) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
  }

  // Unimplemented Properties
  // Node.baseURI – https://developer.mozilla.org/en-US/docs/Web/API/Node/baseURI
  // Node.isConnected – https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
  // Node.nodeValue – https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
  // –––– Implemented at Text layer. Text.nodeValue
  // Node.ownerDocument – https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument
  // Node.compareDocumentPosition() – https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
  // Node.getRootNode() – https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode
  // Node.isDefaultNamespace() – https://developer.mozilla.org/en-US/docs/Web/API/Node/isDefaultNamespace
  // Node.isEqualNode() – https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode
  // Node.isSameNode() – https://developer.mozilla.org/en-US/docs/Web/API/Node/isSameNode
  // Node.lookupPrefix() – https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupPrefix
  // Node.lookupNamespaceURI() – https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupNamespaceURI
  // Node.normalize() – https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize

  // Will Implement at Element layer
  // Node.textContent – https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
  //  - Will implement at the Element level and consider bringing back up to Node.
  // Node.cloneNode – https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild
   * @returns Node's first child in the tree, or null if the node has no children.
   */
  get firstChild(): Node | null {
    return this.childNodes.length > 0 ? this.childNodes[0] : null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild
   * @returns The last child of a node, or null if there are no child elements.
   */
  get lastChild(): Node | null {
    return this.childNodes.length > 0 ? this.childNodes[this.childNodes.length - 1] : null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling
   * @returns node immediately following the specified one in it's parent's childNodes, or null if one doesn't exist.
   */
  get nextSibling(): Node | null {
    if (this.parentNode === null) {
      return null;
    }

    const parentChildNodes = this.parentNode.childNodes;
    return parentChildNodes[parentChildNodes.indexOf(this) + 1] || null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling
   * @returns node immediately preceding the specified one in its parent's childNodes, or null if the specified node is the first in that list.
   */
  get previousSibling(): Node | null {
    if (this.parentNode === null) {
      return null;
    }

    const parentChildNodes = this.parentNode.childNodes;
    return parentChildNodes[parentChildNodes.indexOf(this) - 1] || null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes
   * @returns boolean if the Node has childNodes.
   */
  public hasChildNodes(): boolean {
    return this.childNodes.length > 0;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
   * @param otherNode
   * @returns whether a Node is a descendant of a given Node
   */
  public contains(otherNode: Node | null): boolean {
    if (this.childNodes.length > 0) {
      if (this.childNodes.includes(this)) {
        return true;
      }
      return this.childNodes.some(child => child.contains(otherNode));
    }

    return otherNode === this;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
   * @param child
   * @param referenceNode
   * @returns child after it has been inserted.
   */
  public insertBefore(child: Node | null, referenceNode: Node | undefined | null): Node | null {
    if (child === null) {
      return null;
    }

    if (child === this) {
      // The new child cannot contain the parent.
      return child;
    }

    if (referenceNode == null) {
      // When a referenceNode is not valid, appendChild(child).
      this.appendChild(child);

      // TODO(KB): Restore mutation observation
      // this.mutate(this, 'childList', {
      //   addedNodes: [child],
      //   removedNodes: null,
      //   previousSibling: null,
      //   nextSibling: referenceNode,
      // });

      return child;
    }

    if (this.childNodes.indexOf(referenceNode) >= 0) {
      // Should only insertBefore direct children of this Node.
      child.remove();

      // Removing a child can cause this.childNodes to change, meaning we need to splice from its updated location.
      this.childNodes.splice(this.childNodes.indexOf(referenceNode), 0, child);
      child.parentNode = this;

      // TODO(KB): Restore mutation observation
      // this.mutate(this, 'childList', {
      //   addedNodes: [child],
      //   removedNodes: null,
      //   previousSibling: null,
      //   nextSibling: referenceNode,
      // });

      return child;
    }

    return null;
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

    // TODO(KB): Restore mutation observation.
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
  public removeChild(child: Node): Node | null {
    const index = this.childNodes.indexOf(child);
    const exists = index >= 0;

    if (exists) {
      child.parentNode = null;
      this.childNodes.splice(index, 1);
      return child;
    }
    return null;

    // TODO(KB): Restore mutation observation.
    // this.mutate(this, 'childList', {
    //   addedNodes: null,
    //   removedNodes: exists ? [child] : [],
    //   previousSibling: this.childNodes[i - 1],
    //   nextSibling: this.childNodes[i],
    // });
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild
   * @param newChild new Node to replace old Node.
   * @param oldChild existing Node to be replaced.
   */
  public replaceChild(newChild: Node, oldChild: Node): Node {
    if (newChild !== oldChild) {
      const index = this.childNodes.indexOf(oldChild);
      if (index >= 0) {
        this.childNodes.splice(index, 1, newChild);

        // TODO(KB): Restore mutation observation.
        // this.mutate(this, 'childList', {
        //   addedNodes: [newChild],
        //   removedNodes: [oldChild],
        //   previousSibling: this.childNodes[index - 1],
        //   nextSibling: this.childNodes[index + 1],
        // });
      }
    }

    return oldChild;
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
    let handlers: EventHandler[] = this._handlers_[toLower(type)];
    if (handlers && handlers.length > 0) {
      handlers.push(handler);
    } else {
      this._handlers_[toLower(type)] = [handler];
    }
  }

  /**
   * Remove a registered event listener for a specific event type.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function to stop calling when event is dispatched.
   */
  public removeEventListener(type: string, handler: EventHandler): void {
    const handlers = this._handlers_[toLower(type)];
    const index = handlers.indexOf(handler);

    if (index >= 0) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Dispatch an event for this Node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
   * @param event Event to dispatch to this node and potentially cascade to parents.
   */
  public dispatchEvent(event: Event): boolean {
    let target: Node | null = (event.currentTarget = this);
    let handlers: EventHandler[] | null;
    let iterator: number;

    do {
      handlers = target && target._handlers_ && target._handlers_[toLower(event.type)];
      if (handlers) {
        for (iterator = handlers.length; iterator--; ) {
          if ((handlers[iterator].call(target, event) === false || event._end) && event.cancelable) {
            break;
          }
        }
      }
    } while (event.bubbles && !(event.cancelable && event._stop) && (event.target = target = target && target.parentNode));
    return !event.defaultPrevented;
  }
}
