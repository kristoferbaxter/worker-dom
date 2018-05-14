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

const formatKey = (key: string): string =>
  key
    .replace(/(webkit|ms|moz|khtml)/g, '-$1')
    .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
    .toLowerCase();

export const CSSStyleDeclaration: StyleDeclaration = {
  get cssText(): string {
    return Object.keys(this.__proto__)
      .reduce(
        (accumulator, currentKey) =>
          accumulator + (currentKey !== 'cssText' && !!this[currentKey] ? `${formatKey(currentKey)}: ${this[currentKey]}; ` : ''),
        '',
      )
      .trim();
  },
};

export const appendKeys = (keys: Array<string>): void => {
  keys.forEach(key => {
    if (/\D/.test(key) && key !== 'cssText') {
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
