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

import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { DOMTokenList } from './DOMTokenList';
import { NodeType, NodeName, NamespaceURI } from './Node';

export class HTMLIFrameElement extends HTMLElement {
  // HTMLIFrameElement.sandbox, DOMTokenList, reflected attribute
  public sandbox: DOMTokenList = new DOMTokenList(this, 'sandbox', null, this.storeAttributeNS_.bind(this));

  constructor(nodeType: NodeType, nodeName: NodeName, namespaceURI: NamespaceURI) {
    super(nodeType, nodeName, namespaceURI);

    Object.assign(this.propertyBackedAttributes_, {
      sandbox: (value: string): string => (this.sandbox.value = value),
    });
  }
}
registerSubclass('iframe', HTMLIFrameElement);

// Reflected properties
// HTMLIFrameElement.allow => string, reflected attribute
// HTMLIFrameElement.allowFullscreen => boolean, reflected attribute
// HTMLIFrameElement.csp => string, reflected attribute
// HTMLIFrameElement.height => string, reflected attribute
// HTMLIFrameElement.name => string, reflected attribute
// HTMLIFrameElement.referrerPolicy => string, reflected attribute
// HTMLIFrameElement.src => string, reflected attribute
// HTMLIFrameElement.srcdoc => string, reflected attribute
// HTMLIFrameElement.width => string, reflected attribute
reflectProperties(
  [
    { allow: [''] },
    { allowFullscreen: [false] },
    { csp: [''] },
    { height: [''] },
    { name: [''] },
    { referrerPolicy: [''] },
    { src: [''] },
    { srcdoc: [''] },
    { width: [''] },
  ],
  HTMLIFrameElement,
);

// Unimplemented Properties
// HTMLIFrameElement.allowPaymentRequest => boolean, reflected attribute
// HTMLIFrameElement.contentDocument => Document, read only (active document in the inline frame's nested browsing context)
// HTMLIFrameElement.contentWindow => WindowProxy, read only (window proxy for the nested browsing context)
