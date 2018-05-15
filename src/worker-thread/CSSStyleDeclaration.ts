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

interface StyleDeclaration {
  [key: string]: string;
}

const keyToCssTextFormat = (key: string): string =>
  key
    .replace(/(webkit|ms|moz|khtml)/g, '-$1')
    .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
    .toLowerCase();

export const CSSStyleDeclaration: StyleDeclaration = {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText
   * @return css text string for styles declared with valid values.
   */
  get cssText(): string {
    return Object.keys(this.__proto__)
      .reduce(
        (accumulator, currentKey) =>
          `${accumulator}${currentKey !== 'cssText' && !!this[currentKey] ? `${keyToCssTextFormat(currentKey)}: ${this[currentKey]}; ` : ''}`,
        '',
      )
      .trim();
  },
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText
   */
  set cssText(value: string) {
    const toSet: StyleDeclaration = {};
    const values = value.split(/[:;]/);
    const length = values.length;
    let index = 0;
    while (index + 1 < length) {
      toSet[values[index].trim()] = values[index + 1].trim();
      index += 2;
    }

    Object.keys(this.__proto__).forEach(key => {
      if (key !== 'cssText') {
        this[key] = toSet[key] !== undefined ? toSet[key] : '';
      }
    });
  },
};

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
          },
        },
      });
    }
  });
};
