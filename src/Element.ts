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

import { Node, NodeType } from './Node';
import { DOMTokenList } from './DOMTokenList';
import { Attr, toString as attrsToString, matchPredicate as matchAttrPredicate, NamespaceURI } from './Attr';
import { keyValueString } from './utils';

const isElementPredicate = (node: Node): boolean => node.nodeType === NodeType.ELEMENT_NODE;

type ConditionPredicate = (element: Element) => boolean;
function findMatchingChildren(element: Element, conditionPredicate: ConditionPredicate): Element[] {
  const matchingElements: Element[] = [];
  element.children.forEach(child => {
    if (conditionPredicate(child)) {
      matchingElements.push(child);
    }
    matchingElements.push(...findMatchingChildren(child, conditionPredicate));
  });
  return matchingElements;
}

export class Element extends Node {
  public attributes: Attr[] = [];
  public classList: DOMTokenList = new DOMTokenList(this, 'className', null);
  // No implementation necessary
  // Element.id

  // Unimplemented
  // Element.clientHeight – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
  // Element.clientLeft – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientLeft
  // Element.clientTop – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientTop
  // Element.clientWidth – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
  // Element.querySelector – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
  // Element.querySelectorAll – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
  // set Element.innerHTML – https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
  // Element.localName – https://developer.mozilla.org/en-US/docs/Web/API/Element/localName
  // Element.namespaceURI – https://developer.mozilla.org/en-US/docs/Web/API/Element/namespaceURI
  // NonDocumentTypeChildNode.nextElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling
  // Element.prefix – https://developer.mozilla.org/en-US/docs/Web/API/Element/prefix
  // NonDocummentTypeChildNode.previousElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling
  // Element.scrollHeight – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
  // Element.scrollLeft – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
  // Element.scrollLeftMax – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeftMax
  // Element.scrollTop – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop
  // Element.scrollTopMax – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTopMax
  // Element.scrollWidth – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollWidth
  // Element.shadowRoot – !! CustomElements – https://developer.mozilla.org/en-US/docs/Web/API/Element/shadowRoot
  // Element.slot – !! CustomElements – https://developer.mozilla.org/en-US/docs/Web/API/Element/slot
  // Element.tabStop – https://developer.mozilla.org/en-US/docs/Web/API/Element/tabStop
  // Element.undoManager – https://developer.mozilla.org/en-US/docs/Web/API/Element/undoManager
  // Element.undoScope – https://developer.mozilla.org/en-US/docs/Web/API/Element/undoScope
  // Element.attachShadow() – !! CustomElements – https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
  // Element.animate() – https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
  // Element.closest() – https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  // Element.getAttributeNames() – https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames
  // Element.getBoundingClientRect() – https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  // Element.getClientRects() – https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects
  // Element.getElementsByTagNameNS() – https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagNameNS
  // Element.insertAdjacentElement() – https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
  // Element.insertAdjacentHTML() – https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
  // Element.insertAdjacentText() – https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText
  // Element.matches() – https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
  // Element.querySelector() – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
  // Element.querySelectorAll() – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
  // Element.releasePointerCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/releasePointerCapture
  // Element.requestFullscreen() – https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
  // Element.requestPointerLock() – https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock
  // Element.scrollIntoView() – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  // Element.setCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/setCapture
  // Element.setPointerCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture

  // Mixins not implemented
  // Slotable.assignedSlot – https://developer.mozilla.org/en-US/docs/Web/API/Slotable/assignedSlot

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   * @return string representation of the Element's class.
   */
  get className(): string {
    return this.classList.value;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   * @param value new string representaiton of the Element's class.
   */
  set className(value: string) {
    this.classList.value = value;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML
   * @return string representation of serialized HTML describing the Element and its descendants.
   */
  get outerHTML(): string {
    return `<${[this.nodeName, keyValueString('class', this.className), attrsToString(this.attributes)].join(' ').trim()}>${this.innerHTML}</${this.nodeName}>`;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
   * @return string representation of serialized HTML describing the Element's descendants.
   */
  get innerHTML(): string {
    const children = this.children;

    if (children.length) {
      return children.map(child => child.outerHTML).join('');
    }
    return '';
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
   * @return string tag name (i.e 'div')
   */
  get tagName(): string {
    return this.nodeName;
  }

  /**
   * Getter returning children of an Element that are Elements themselves.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
   * @return Element objects that are children of this ParentNode, omitting all of its non-element nodes.
   */
  get children(): Element[] {
    return this.childNodes.filter(isElementPredicate) as Element[];
  }

  /**
   * Getter returning the number of child elements of a Element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/childElementCount
   * @return number of child elements of the given Element.
   */
  get childElementCount(): number {
    return this.children.length;
  }

  /**
   * Getter returning the first Element in Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild
   * @return first childNode that is also an element.
   */
  get firstElementChild(): Element | null {
    return (this.childNodes.find(isElementPredicate) as Element) || null;
  }

  /**
   * Getter returning the last Element in Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/lastElementChild
   * @return first childNode that is also an element.
   */
  get lastElementChild(): Element | null {
    const children = this.children;
    return children[children.length - 1] || null;
  }

  /**
   * Sets the value of an attribute on this element using a null namespace.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
   * @param name attribute name
   * @param value attribute value
   */
  public setAttribute(name: string, value: string): void {
    this.setAttributeNS(null, name, value);
  }

  /**
   * Get the value of an attribute on this Element with the null namespace.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
   * @param name attribute name
   * @return value of a specified attribute on the element, or null if the attribute doesn't exist.
   */
  public getAttribute(name: string): string | null {
    return this.getAttributeNS(null, name);
  }

  /**
   * Remove an attribute from this element in the null namespace.
   *
   * Method returns void, so it is not chainable.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute
   * @param name attribute name
   */
  public removeAttribute(name: string): void {
    this.removeAttributeNS(null, name);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute
   * @param name attribute name
   * @return Boolean indicating if the element has the specified attribute.
   */
  public hasAttribute(name: string): boolean {
    return this.hasAttributeNS(null, name);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributes
   * @return Boolean indicating if the element has any attributes.
   */
  public hasAttributes(): boolean {
    return this.attributes.length > 0;
  }

  /**
   * Sets the value of an attribute on this Element with the provided namespace.
   *
   * If the attribute already exists, the value is updated; otherwise a new attribute is added with the specified name and value.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNS
   * @param namespaceURI
   * @param name attribute name
   * @param value attribute value
   */
  public setAttributeNS(namespaceURI: NamespaceURI, name: string, value: string): void {
    const attr = this.attributes.find(matchAttrPredicate(namespaceURI, name));
    // TODO(KB) – Restore mutation support
    // const oldValue = attr.value;

    if (attr) {
      attr.value = value;
    } else {
      this.attributes.push({
        namespaceURI,
        name,
        value,
      });
    }

    // TODO(KB) – Restore mutation support
    // this.mutate(this, 'attributes', {
    //   attributeName: name,
    //   attributeNamespace: ns,
    //   value,
    //   oldValue,
    // });
  }

  /**
   * Get the value of an attribute on this Element with the specified namespace.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS
   * @param namespaceURI attribute namespace
   * @param name attribute name
   * @return value of a specified attribute on the element, or null if the attribute doesn't exist.
   */
  public getAttributeNS(namespaceURI: NamespaceURI, name: string): string | null {
    const attr = this.attributes.find(matchAttrPredicate(namespaceURI, name));

    return (attr && attr.value) || null;
  }

  /**
   * Remove an attribute from this element in the specified namespace.
   *
   * Method returns void, so it is not chainable.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute
   * @param namespaceURI attribute namespace
   * @param name attribute name
   */
  public removeAttributeNS(namespaceURI: NamespaceURI, name: string): void {
    const index = this.attributes.findIndex(matchAttrPredicate(namespaceURI, name));

    if (index >= 0) {
      // TODO(KB) – Restore mutation support
      // const oldValue = this.attributes[index].value;
      this.attributes.splice(index, 1);

      // TODO(KB) – Restore mutation support
      // this.mutate(this, 'attributes', {
      //   attributeName: name,
      //   attributeNamespace: ns,
      //   oldValue: oldValue,
      // });
    }
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributeNS
   * @param namespaceURI attribute namespace
   * @param name attribute name
   * @return Boolean indicating if the element has the specified attribute.
   */
  public hasAttributeNS(namespaceURI: NamespaceURI, name: string): boolean {
    return this.attributes.some(matchAttrPredicate(namespaceURI, name));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
   * @param names contains one more more classnames to match on. Multiples are space seperated, indicating an AND operation.
   * @return Element array with matching classnames
   */
  public getElementsByClassName(names: string): Element[] {
    const inputClassList = names.split(' ');
    // TODO(KB) – Compare performance of [].some(value => DOMTokenList.contains(value)) and regex.
    // const classRegex = new RegExp(classNames.split(' ').map(name => `(?=.*${name})`).join(''));

    return findMatchingChildren(this, element => inputClassList.some(inputClassName => element.classList.contains(inputClassName)));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
   * @param tagName the qualified name to look for. The special string "*" represents all elements.
   * @return Element array with matching tagnames
   */
  public getElementsByTagName(tagName: string): Element[] {
    return findMatchingChildren(this, tagName === '*' ? element => true : element => element.tagName === tagName);
  }
}

export class SVGElement extends Element {}
