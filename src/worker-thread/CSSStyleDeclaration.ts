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

export interface StyleDeclaration {
  mutate?: (newValue: string) => void;
  [key: string]: any;
}

const declarationKeyToCssText = (key: string): string =>
  key
    // Key with prefix, add a dash before the prefix.
    .replace(/(webkit|ms|moz|khtml)/g, '-$1')
    // Key with multiple terms (ie. lineHeight), add a dash between lowercase letter and capital letter.
    .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
    .toLowerCase();

const cssTextToDeclarationKey = (text: string): string =>
  text
    .toLowerCase()
    // text with vendor prefix, remove dash before prefix
    .replace(/(?:-)(webkit|ms|moz|khtml)/g, '$1')
    // text with multiple terms are seperated by a dash, convert this to camelCase.
    .replace(/(?:-)([a-z])/g, (match: any, p1: string): string => `${p1.toUpperCase()}`);

/**
 * A few notes about CSSStyleDeclaration implementation.
 *
 * Q: Why is this.__proto__ used when getting and setting cssText?
 * A: Because the valid getter/setter keys are stored on a CSSStyleDeclaration.
 *    Usages are expected via Object.create(CSSStyleDeclaration).
 *
 * Q: Why do the getter and setter store values on a direct instance instead of in the prototype?
 * A: The value of the key is stored locally on instances of a CSSStyleDeclaration to allow each instance to have its own values.
 *    But this allows all instances to share the known set of valid keys for getters/setters.
 */
export const CSSStyleDeclaration: StyleDeclaration = {
  /**
   * Getting cssText requires converting declaration properties to a known string output format.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText
   * @return css text string for styles declared with valid values.
   */
  get cssText(): string {
    return Object.keys(this.__proto__)
      .reduce(
        (accumulator, currentKey) =>
          `${accumulator}${currentKey !== 'cssText' && !!this[currentKey] ? `${declarationKeyToCssText(currentKey)}: ${this[currentKey]}; ` : ''}`,
        '',
      )
      .trim();
  },
  /**
   * Setting cssText removes all known style declaration properties, and applies those from the string passed.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText
   * @param value new cssText value to store.
   */
  set cssText(value: string) {
    const toSet: StyleDeclaration = {};
    const values = value.split(/[:;]/);
    const length = values.length;
    let index = 0;
    while (index + 1 < length) {
      toSet[cssTextToDeclarationKey(values[index].trim())] = values[index + 1].trim();
      index += 2;
    }

    Object.keys(this.__proto__).forEach(key => {
      if (key !== 'cssText') {
        this[key] = toSet[key] !== undefined ? toSet[key] : '';
      }
    });
  },
};

/**
 * Defines new keys for all CSSStyleDeclaration Objects.
 * These keys will be used to create getters and setters.
 *
 * Keys are known from either a static list (in node), or a sentinel element (in browser main thread).
 * @param keys camelCase keys to create getters and setters for.
 */
export const appendKeys = (keys: Array<string>): void => {
  keys.forEach(key => {
    if (/\D/.test(key) && key !== 'cssText' && CSSStyleDeclaration[key] !== '') {
      Object.defineProperties(CSSStyleDeclaration, {
        [key]: {
          enumerable: true,
          get(): string {
            return this[`_${key}`] || '';
          },
          set(val: string): void {
            this[`_${key}`] = val;
            !!this.mutate && this.mutate(this.cssText);
          },
        },
      });
    }
  });
};
