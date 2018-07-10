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

const config = ({ esmodules, forMainThread }) => {
  return {
    input: `src/output/${forMainThread ? 'main-thread' : 'worker-thread'}/index.js`,
    output: [
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
    ],
    plugins: [
      resolve(),
      babelPlugin(esmodules),
      MINIFY_BUNDLE_VALUE ? minifyPlugin() : null,
      COMPRESS_BUNDLE_VALUE ? brotliPlugin() : null,
      COMPRESS_BUNDLE_VALUE ? gzipPlugin() : null,
    ].filter(Boolean),
  };
};

export default [
  config({ esmodules: false, forMainThread: false }),
  config({ esmodules: true, forMainThread: false }),
  config({ esmodules: false, forMainThread: true }),
  config({ esmodules: true, forMainThread: true }),
];
