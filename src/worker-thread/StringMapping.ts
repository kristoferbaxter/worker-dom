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

let count: number = 0;
let transfer: Array<string> = [];
const mapping: Map<string, number> = new Map();

/**
 * Stores a string in mapping and returns the index of the location.
 * @param value string to store
 * @return location in map
 */
export function store(value: string): number {
  if (mapping.has(value)) {
    // Safe to cast since we verified the mapping contains the value
    return mapping.get(value) as number;
  }

  mapping.set(value, ++count);
  transfer.push(value);
  return count;
}

/**
 * Returns strings registered but not yet transferred.
 * Side effect: Resets the transfer array to default value, to prevent passing the same values multiple times.
 */
export function consume(): Array<string> {
  const strings = transfer;
  transfer = [];
  return strings;
}
