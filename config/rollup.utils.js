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

// This file uses CJS format since it's consumed by Babel and Rollup.
// Babel 7 .babelrc.js files must use CJS, and Rollup configuration can be either.
// This means we must use CJS for common functionality.

const { DEBUG_BUNDLE = false, UGLIFY_BUNDLE = false, COMPRESS_BUNDLE = false } = process.env;

export let DEBUG_BUNDLE_VALUE = DEBUG_BUNDLE === 'true';
export let UGLIFY_BUNDLE_VALUE = UGLIFY_BUNDLE === 'true';
export let COMPRESS_BUNDLE_VALUE = COMPRESS_BUNDLE === 'true';

/**
 * @param {boolean} esmodules
 * @param {boolean} forMainThread
 * @param {string} filename
 * @return {string} path to filename including filename.
 */
export function path(esmodules, forMainThread, filename) {
  return [
    DEBUG_BUNDLE_VALUE ? 'demo' : undefined,
    'build',
    esmodules === true ? 'esmodules' : undefined,
    forMainThread === true ? 'main-thread' : undefined,
    filename,
  ].reduce((accumulator, currentValue) => {
    if (accumulator === undefined) {
      return currentValue || '';
    } else if (currentValue !== undefined) {
      return `${accumulator}/${currentValue}`;
    }

    return accumulator;
  });
}