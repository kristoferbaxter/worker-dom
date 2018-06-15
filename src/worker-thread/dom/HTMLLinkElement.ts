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

export class HTMLLinkElement extends HTMLElement {
  public relList: DOMTokenList = new DOMTokenList(this, 'rel', null, this.storeAttributeNS_.bind(this));

  /**
   * Getter returning value of rel property/reflected attribute
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement/rel
   * @return value of the rel property/attribute.
   */
  get rel(): string {
    return this.relList.value;
  }
}
registerSubclass('link', HTMLLinkElement);

// Reflected Properties
// HTMLLinkElement.as => string, reflected attribute
// HTMLLinkElement.crossOrigin => string, reflected attribute
// HTMLLinkElement.disabled => boolean, reflected attribute
// HTMLLinkElement.href => string, reflected attribute
// HTMLLinkElement.hreflang => string, reflected attribute
// HTMLLinkElement.media => string, reflected attribute
// HTMLLinkElement.referrerPolicy => string, reflected attribute
// HTMLLinkElement.sizes => string, reflected attribute
// HTMLLinkElement.type => string, reflected attribute
reflectProperties(
  [
    { as: [''] },
    { crossOrigin: [''] },
    { disabled: [false] },
    { href: [''] },
    { hreflang: [''] },
    { media: [''] },
    { referrerPolicy: [''] },
    { sizes: [''] },
    { type: [''] },
  ],
  HTMLLinkElement,
);

// Unimplemented Properties
// LinkStyle.sheet Read only
// Returns the StyleSheet object associated with the given element, or null if there is none.