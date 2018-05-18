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

import { NamespaceURI } from './Attr';
import { mutate } from './MutationObserver';
import { MutationRecordType } from './MutationRecord';
import { Element } from './Element';

interface StyleProperties {
  [key: string]: string | null;
}
interface StyleDeclaration {
  $$properties: StyleProperties;
  getPropertyValue: (key: string) => string;
  removeProperty: (key: string) => void;
  setProperty: (key: string, value: string) => void;
  cssText: string;
  [key: string]:
    | string
    | number
    | StyleProperties
    | ((key: string) => string)
    | ((key: string) => void)
    | ((key: string, value: string) => void)
    | ((namespaceURI: NamespaceURI, name: string, value: string) => void);
}

const hyphenateKey = (key: string): string =>
  key
    .replace(/(webkit|ms|moz|khtml)/g, '-$1')
    .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
    .toLowerCase();

export const appendKeys = (keys: Array<string>): void => {
  const keysToAppend = keys.filter(key => !CSSStyleDeclaration.prototype.hasOwnProperty(key));
  const previousPrototypeLength = (CSSStyleDeclaration.prototype.length || 0) as number;

  if (keysToAppend.length > 0) {
    if (previousPrototypeLength !== 0) {
      CSSStyleDeclaration.prototype.length = previousPrototypeLength + keysToAppend.length;
    } else {
      Object.defineProperty(CSSStyleDeclaration.prototype, 'length', {
        configurable: true,
        writable: true,
        value: keysToAppend.length,
      });
    }

    keysToAppend.forEach((key: string, index: number): void => {
      const hyphenatedKey = hyphenateKey(key);
      CSSStyleDeclaration.prototype[index + previousPrototypeLength] = hyphenatedKey;

      Object.defineProperties(CSSStyleDeclaration.prototype, {
        [index + previousPrototypeLength]: {
          value: hyphenatedKey,
        },
        [key]: {
          get() {
            return this.getPropertyValue(hyphenatedKey);
          },
          set(value) {
            this.setProperty(hyphenatedKey, value);
          },
        },
      });
    });
  }
};

export class CSSStyleDeclaration implements StyleDeclaration {
  [key: string]:
    | string
    | number
    | StyleProperties
    | ((key: string) => string)
    | ((key: string) => void)
    | ((key: string, value: string) => void)
    | ((namespaceURI: NamespaceURI, name: string, value: string) => void);
  $$properties: StyleProperties = {};
  private storeAttributeMethod: (namespaceURI: NamespaceURI, name: string, value: string) => string;
  private element: Element;

  constructor(element: Element, storeAttributeMethod: (namespaceURI: NamespaceURI, name: string, value: string) => string) {
    this.storeAttributeMethod = storeAttributeMethod;
    this.element = element;
  }

  getPropertyValue(key: string): string {
    return this.$$properties[key] || '';
  }
  removeProperty(key: string): void {
    this.$$properties[key] = null;
  }
  setProperty(key: string, value: string): void {
    this.$$properties[key] = value;

    const newValue = this.cssText;
    const oldValue = this.storeAttributeMethod(null, 'style', newValue);
    mutate({
      type: MutationRecordType.ATTRIBUTES,
      target: this.element,
      attributeName: 'style',
      attributeNamespace: null,
      value: newValue,
      oldValue,
    });
  }
  get cssText(): string {
    return Object.keys(this.$$properties)
      .reduce((accumulator, key) => accumulator + (this.$$properties[key] !== '' ? `${key}: ${this.$$properties[key]}; ` : ''), '')
      .trim();
  }
  set cssText(value: string) {
    this.$$properties = {};

    const values = value.split(/[:;]/);
    const length = values.length;
    for (let index = 0; index + 1 < length; index += 2) {
      this.$$properties[values[index].trim().toLowerCase()] = values[index + 1].trim();
    }
    const oldValue = this.storeAttributeMethod(null, 'style', value);
    mutate({
      type: MutationRecordType.ATTRIBUTES,
      target: this.element,
      attributeName: 'style',
      attributeNamespace: null,
      value,
      oldValue,
    });
  }
}
