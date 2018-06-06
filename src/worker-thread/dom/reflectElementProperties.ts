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

import { Element } from './Element';
import { toLower } from '../../utils';

interface PropertyPair {
  [key: string]: [string | boolean, string] | [string | boolean];
}
export const reflectProperties = (properties: Array<PropertyPair>, defineOn: typeof Element): void => {
  properties.forEach(pair => {
    Object.keys(pair).forEach(key => {
      const enforceBooleanAttributes = typeof pair[key][0] === 'boolean';
      const attributeKey = (pair[key][1] as string) || toLower(key);
      Object.defineProperty(defineOn.prototype, key, {
        configurable: false,
        get(): string | boolean {
          const storedAttribute = (this as Element).getAttribute(attributeKey);
          if (enforceBooleanAttributes) {
            return storedAttribute !== null ? storedAttribute === 'true' : pair[key][0];
          }
          return String(storedAttribute !== null ? storedAttribute : pair[key][0]);
        },
        set(value: string | boolean) {
          (this as Element).setAttribute(attributeKey, String(value));
        },
      });
    });
  });
};
