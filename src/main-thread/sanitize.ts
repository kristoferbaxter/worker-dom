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

import purify from 'dompurify';

const propertyToAttribute: { [key: string]: string } = {}; // TODO

/**
 * @param node
 */
export function sanitize(node: Node): void {
  debugger;
  const start = performance.now();
  purify.sanitize(node, { IN_PLACE: true });
  const latency = performance.now() - start;
  console.log({ latency });
}

/**
 * @param tag
 * @param attr
 * @param value
 */
export function validAttribute(tag: string, attr: string, value: string): boolean {
  return purify.isValidAttribute(tag, attr, value);
}

/**
 * @param tag
 * @param prop
 * @param value
 */
export function validProperty(tag: string, prop: string, value: string): boolean {
  const attr = propertyToAttribute[prop];
  if (attr) {
    return validAttribute(tag, attr, value);
  } else {
    return validAttribute(tag, prop, value);
  }
}
