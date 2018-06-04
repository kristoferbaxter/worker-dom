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

import { reflectProperties, registerSubclass, findMatchingChildren, Element } from './Element';
import { HTMLElement } from './HTMLElement';

const matchingChildElementTagNames = 'button,fieldset,input,object,output,select,textarea'.split(',');

export class HTMLFieldSetElement extends HTMLElement {
  /**
   * HTMLFieldSetElement.type - read only
   * The DOMString "fieldset".
   */
  get type(): string {
    return 'fieldset';
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement
   * @return Element array matching children of specific tagnames.
   */
  get elements(): Array<Element> {
    return findMatchingChildren(this, element => matchingChildElementTagNames.includes(element.tagName));
  }
}
registerSubclass('data', HTMLFieldSetElement);

// Reflected properties
// HTMLFieldSetElement.name => string, reflected attribute
// HTMLFieldSetElement.disabled => boolean, reflected attribute
reflectProperties([{ name: '' }, { disabled: false }], HTMLFieldSetElement);

// Unimplemented properties
// HTMLFieldSetElement.validity
// HTMLFieldSetElement.willValidate
// HTMLFieldSetElement.validationMessage
// HTMLFieldSetElement.form – Walks up the dom tree to find the nearest form.

/*
HTMLFieldSetElement.form - read only
An HTMLFormControlsCollection or HTMLCollection referencing the containing form element, if this element is in a form.
If the field set is not a descendant of a form element, then the attribute can be the ID of any form element in the same document it is related to, or the null value if none matches.
*/
