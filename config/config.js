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

const { DEBUG_BUNDLE = false, UGLIFY_BUNDLE = false } = process.env;

const envFlags = {
  DEBUG_BUNDLE: DEBUG_BUNDLE === 'true',
  UGLIFY_BUNDLE: UGLIFY_BUNDLE === 'true',
};

/**
 * @param {boolean} esmodules
 * @param {boolean} forMainThread
 * @param {string} filename
 * @returns {string} path to filename including filename.
 */
function path(esmodules, forMainThread, filename) {
  return [
    envFlags.DEBUG_BUNDLE ? 'debugger' : undefined,
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

module.exports = {
  envFlags,
  path
};