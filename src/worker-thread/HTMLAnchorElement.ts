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

import { NodeType, NodeName, NamespaceURI } from './Node';
import { reflectProperties, registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { DOMTokenList } from './DOMTokenList';

export class HTMLAnchorElement extends HTMLElement {
  public relList: DOMTokenList = new DOMTokenList(this, 'rel', null, this.storeAttributeNS.bind(this));

  constructor(nodeType: NodeType, nodeName: NodeName, namespaceURI: NamespaceURI) {
    super(nodeType, nodeName, namespaceURI);

    Object.assign(this.propertyBackedAttributes, {
      rel: (value: string): string => (this.rel = value),
    });
  }

  /**
   * Returns the href property/attribute value
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/toString
   * @return string href attached to HTMLAnchorElement
   */
  public toString(): string {
    return this.href;
  }

  /**
   * Getter returning value of rel property/reflected attribute
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/rel
   * @return value of the rel property/attribute.
   */
  get rel(): string {
    return this.relList.value;
  }

  /**
   * Setter providing value of rel property/reflected attribute
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/rel
   * @param value new rel value
   */
  set rel(value: string) {
    this.relList.value = value;
  }

  /**
   * A Synonym for the Node.textContent property getter.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
   * @return value of text node direct child of this Element.
   */
  get text(): string {
    return this.textContent;
  }

  /**
   * A Synonym for the Node.textContent property setter.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
   * @param text replacement for all current childNodes.
   */
  set text(text: string) {
    this.textContent = text;
  }
}
registerSubclass('a', HTMLAnchorElement);

// Reflected properties, strings.
// HTMLAnchorElement.href => string, reflected attribute
// HTMLAnchorElement.hreflang => string, reflected attribute
// HTMLAnchorElement.media => string, reflected attribute
// HTMLAnchorElement.target => string, reflected attribute
// HTMLAnchorElement.type => string, reflected attribute
reflectProperties([{ href: '' }, { hreflang: '' }, { media: '' }, { target: '' }, { type: '' }], HTMLAnchorElement, false);

// Unimplemented
// HTMLAnchorElement.download => string, reflected attribute
// HTMLAnchorElement.type => Is a DOMString that reflects the type HTML attribute, indicating the MIME type of the linked resource.

// Unimplemented URL parse of href attribute due to IE11 compatibility and low usage.
// Note: Implementation doable using a private url property
/*
  class { 
    private url: URL | null = null;

    constructor(...) {
      // Element.getAttribute('href') => Element.href.
      Object.assign(this.propertyBackedAttributes, {
        href: this.href,
      }); 
    }

    get href(): string {
      return this.url ? this.url.href : '';
    }
    set href(url: string) {
      this.url = new URL(url);
      this.setAttribute('href', this.url.href);
    }
  }
*/
// HTMLAnchorElement.host => string
// HTMLAnchorElement.hostname => string
// HTMLAnchorElement.protocol => string
// HTMLAnchorElement.pathname => string
// HTMLAnchorElement.search => string
// HTMLAnchorElement.hash => string
// HTMLAnchorElement.username => string
// HTMLAnchorElement.password => string
// HTMLAnchorElement.origin => string, readonly (getter no setter)
