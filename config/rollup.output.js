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

import {path, DEBUG_BUNDLE_VALUE} from './rollup.utils.js';

/**
 * @param {boolean} esmodules
 * @param {boolean} forMainThread
 * @return {Array<OutputConfig>} Rollup configurations for output.
 */
export function output(esmodules, forMainThread) {
  return [
    {
      file: path(esmodules, forMainThread, 'index.module.js'),
      format: 'es',
      sourcemap: true,
      outro: forMainThread ? 'window.MainThread = {upgradeElement: upgradeElement};' : '',
    },
    {
      file: path(esmodules, forMainThread, 'index.js'),
      format: 'iife',
      sourcemap: true,
      name: forMainThread ? 'MainThread' : 'WorkerThread',
    },
    {
      file: path(esmodules, forMainThread, 'debug.js'),
      format: 'iife',
      sourcemap: true,
      name: forMainThread ? 'MainThread' : 'WorkerThread',
      outro: DEBUG_BUNDLE_VALUE && !forMainThread ? 'window.workerDocument = monkey.document;' : '',
    },
  ];
}
