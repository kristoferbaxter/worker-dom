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

const pool: Array<string> = [];
let transmittedIndex: number = 0;

export function stringPosition(value: string): number {
  const index = pool.indexOf(value);
  return index >= 0 ? index : pool.push(value);
}

export function transfer(): Array<string> {
  const beforeIndex = transmittedIndex;

  transmittedIndex = pool.length;
  return pool.slice(beforeIndex);
}
