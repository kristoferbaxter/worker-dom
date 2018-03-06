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

export function assign(obj: { [index: string]: any }, props: { [index: string]: any }): void {
  for (let iterator in props) obj[iterator] = props[iterator];
}

export function toLower(string: string): string {
  return string.toLowerCase();
}

export function splice<T>(array: T[], item: T, add: any, byValueOnly: boolean): number {
  let i = array ? findWhere(array, item, true, byValueOnly) : -1;
  if (~i) {
    add ? array.splice(i, 0, add) : array.splice(i, 1);
  }
  return i;
}

export function findWhere(array: any[], fn: any, returnIndex: boolean, byValueOnly: boolean): any {
  let iterator = array.length;
  while (iterator--) {
    if (typeof fn === 'function' && !byValueOnly ? fn(array[iterator]) : array[iterator] === fn) {
      break;
    }
  }
  return returnIndex ? iterator : array[iterator];
}

interface Attribute {
  ns: string;
  name: string;
}
export function createAttributeFilter(ns: string, name: string): (attribute: Attribute) => boolean {
  return o => o.ns === ns && toLower(o.name) === toLower(name);
}
