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

import { babelPlugin, minifyPlugin, brotliPlugin, gzipPlugin } from './rollup.plugins.js';
import { path, MINIFY_BUNDLE_VALUE, DEBUG_BUNDLE_VALUE, COMPRESS_BUNDLE_VALUE } from './rollup.utils.js';
import resolve from 'rollup-plugin-node-resolve';

const rollupConfig = ({ esmodules, forMainThread, withSanitizer }) => {
  return {
    input: `src/output/${forMainThread ? 'main-thread' : 'worker-thread'}/index.js`,
    output: [
      {
        file: path(esmodules, forMainThread, withSanitizer, 'index.module'),
        format: 'es',
        sourcemap: true,
      },
      {
        file: path(esmodules, forMainThread, withSanitizer, 'index'),
        format: 'iife',
        sourcemap: true,
        name: forMainThread ? 'MainThread' : 'WorkerThread',
      },
      {
        file: path(esmodules, forMainThread, withSanitizer, 'debug'),
        format: 'iife',
        sourcemap: true,
        name: forMainThread ? 'MainThread' : 'WorkerThread',
        outro: DEBUG_BUNDLE_VALUE && !forMainThread ? 'window.workerDocument = monkey.document;' : '',
      },
    ],
    plugins: [
      resolve(),
      babelPlugin(esmodules, withSanitizer),
      MINIFY_BUNDLE_VALUE ? minifyPlugin() : null,
      COMPRESS_BUNDLE_VALUE ? brotliPlugin() : null,
      // COMPRESS_BUNDLE_VALUE ? gzipPlugin() : null,
    ].filter(Boolean),
  };
};

/**
 * Returns array of objects containing all boolean combinations of keys in `params`.
 * @param {!Array<string>} params
 */
function allCombinationsOf(params) {
  let configs = [{}];
  params.forEach(p => {
    const next = [];
    configs.forEach(c => {
      next.push(Object.assign({}, c, {[p]: true}));
      next.push(Object.assign({}, c, {[p]: false}));
    });
    configs = next;
  });
  return configs;
}

export default allCombinationsOf(['esmodules', 'forMainThread', 'withSanitizer']).map(c => rollupConfig(c));
