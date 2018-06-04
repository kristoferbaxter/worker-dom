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

import { Node, NodeType, NodeName, NamespaceURI } from './Node';
import { DOMTokenList } from './DOMTokenList';
import { Attr, toString as attrsToString, matchPredicate as matchAttrPredicate } from './Attr';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { TransferableNode, TransferredNode } from '../../transfer/TransferableNodes';
import { NumericBoolean, toLower } from '../../utils';
import { Text } from './Text';
import { CSSStyleDeclaration } from './CSSStyleDeclaration';

const isElementPredicate = (node: Node): boolean => node.nodeType === NodeType.ELEMENT_NODE;

type ConditionPredicate = (element: Element) => boolean;
export function findMatchingChildren(element: Element, conditionPredicate: ConditionPredicate): Element[] {
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
  public classList: DOMTokenList = new DOMTokenList(this, 'class', null, this.storeAttributeNS.bind(this));
  public style: CSSStyleDeclaration = new CSSStyleDeclaration(this, this.storeAttributeNS.bind(this));
  public namespaceURI: NamespaceURI;
  protected propertyBackedAttributes: { [key: string]: (value: string) => string } = {
    class: (value: string): string => (this.className = value),
    style: (value: string): string => (this.style.cssText = value),
  };

  constructor(nodeType: NodeType, nodeName: NodeName, namespaceURI: NamespaceURI) {
    super(nodeType, nodeName);
    this.namespaceURI = namespaceURI;
  }

  // Unimplemented properties
  // Element.clientHeight – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
  // Element.clientLeft – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientLeft
  // Element.clientTop – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientTop
  // Element.clientWidth – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
  // Element.querySelector – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
  // Element.querySelectorAll – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
  // set Element.innerHTML – https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
  // Element.localName – https://developer.mozilla.org/en-US/docs/Web/API/Element/localName
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

  // Unimplemented Methods
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
    const outputTagName = toLower(this.nodeName);
    return `<${[outputTagName, attrsToString(this.attributes)].join(' ').trim()}>${this.innerHTML}</${outputTagName}>`;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
   * @return string representation of serialized HTML describing the Element's descendants.
   */
  get innerHTML(): string {
    const childNodes = this.childNodes;

    if (childNodes.length) {
      return childNodes.map(child => (child.nodeType === NodeType.ELEMENT_NODE ? child.outerHTML : child.textContent)).join('');
    }
    return '';
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
   * @param text new text replacing all childNodes content.
   */
  set textContent(text: string) {
    // TODO(KB): Investigate removing all children in a single .splice to childNodes.
    this.childNodes.forEach(childNode => childNode.remove());
    this.appendChild(new Text(text));
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
    if (namespaceURI === null && Object.keys(this.propertyBackedAttributes).includes(name)) {
      this.propertyBackedAttributes[name](value);
      return;
    }

    const oldValue = this.storeAttributeNS(namespaceURI, name, value);
    mutate({
      type: MutationRecordType.ATTRIBUTES,
      target: this,
      attributeName: name,
      attributeNamespace: namespaceURI,
      value,
      oldValue,
    });
  }

  protected storeAttributeNS(namespaceURI: NamespaceURI, name: string, value: string): string {
    const attr = this.attributes.find(matchAttrPredicate(namespaceURI, name));
    const oldValue = (attr && attr.value) || '';

    if (attr) {
      attr.value = value;
    } else {
      this.attributes.push({
        namespaceURI,
        name,
        value,
      });
    }
    return oldValue;
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

    return attr ? attr.value : null;
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
      const oldValue = this.attributes[index].value;
      this.attributes.splice(index, 1);

      mutate({
        type: MutationRecordType.ATTRIBUTES,
        target: this,
        attributeName: name,
        attributeNamespace: namespaceURI,
        oldValue,
      });
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

  public _sanitize_(): TransferableNode | TransferredNode {
    if (this._transferred_ !== null) {
      return this._transferred_;
    }

    Promise.resolve().then(_ => {
      // After transmission of the current unsanitized form across a message, we can start to send the more compressed format.
      this._transferred_ = {
        _index_: this._index_,
        transferred: NumericBoolean.TRUE,
      };
    });
    return {
      _index_: this._index_,
      transferred: NumericBoolean.FALSE,
      nodeType: this.nodeType,
      nodeName: this.nodeName,
      attributes: this.attributes,
      properties: [], // TODO(KB): Properties!
      childNodes: this.childNodes.map(childNode => childNode._sanitize_()),
    };
  }
}

interface PropertyPair {
  [key: string]: string | boolean;
}
export const reflectProperties = (properties: Array<PropertyPair>, defineOn: typeof Element): void => {
  properties.forEach(pair => {
    Object.keys(pair).forEach(key => {
      const enforceBooleanAttributes = typeof pair[key] === 'boolean';
      const lowerCaseKey = key.toLowerCase();
      Object.defineProperty(defineOn.prototype, key, {
        configurable: false,
        get(): string | boolean {
          const storedAttribute = (this as Element).getAttribute(lowerCaseKey);
          if (enforceBooleanAttributes) {
            return storedAttribute !== null ? storedAttribute === 'true' : pair[key];
          }
          return String(storedAttribute !== null ? storedAttribute : pair[key]);
        },
        set(value: string | boolean) {
          (this as Element).setAttribute(lowerCaseKey, String(value));
        },
      });
    });
  });
};

reflectProperties([{ id: '' }], Element);

export const NodeNameMapping: {
  [key: string]: typeof Element;
} = {};
export const registerSubclass = (nodeName: NodeName, subclass: typeof Element): void => {
  NodeNameMapping[nodeName] = subclass;
};
