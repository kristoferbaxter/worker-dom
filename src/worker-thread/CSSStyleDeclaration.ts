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

export const CSSStyleDeclaration: StyleDeclaration = {
  get cssText(): string {
    const keys = Object.keys(this.__proto__);
    return keys.reduce((accumulator, currentKey) => {
      return accumulator + (currentKey !== 'cssText' && !this[currentKey] ? `${currentKey}=${this[currentKey]};` : '');
    }, '');
  },
};

export function appendKeys(keys: Array<string>): void {
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
}
