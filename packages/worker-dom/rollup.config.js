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

import compiler from '@ampproject/rollup-plugin-closure-compiler';
import babel from 'rollup-plugin-babel';
const MINIFY_BUNDLE_VALUE = process.env.MINIFY_BUNDLE !== 'undefined' ? process.env.MINIFY_BUNDLE === 'true' : false;

function babelPlugin(esmodules = true, removeConsole = true) {
  const targets = esmodules ? { esmodules: true } : { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'] };
  const exclude = removeConsole ? [] : ['error', 'warn', 'info', 'log', 'time', 'timeEnd'];

  return babel({
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/env',
        {
          targets,
          loose: true,
          modules: false,
        },
      ],
    ],
    plugins: [
      ['@babel/plugin-proposal-object-rest-spread'],
      ['@babel/proposal-class-properties'],
      ['babel-plugin-transform-remove-console', { exclude }]
    ],
  });
};

export default [
  {
    input: 'output/worker-dom/src/index.js',
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      babelPlugin(true, false),
      MINIFY_BUNDLE_VALUE ? compiler() : null,
    ].filter(Boolean),
  },
  {
    input: 'output/worker-dom/src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'iife',
      sourcemap: true,
      name: 'WorkerThread',
    },
    plugins: [
      babelPlugin(false, false),
      MINIFY_BUNDLE_VALUE ? compiler() : null,
    ].filter(Boolean),
  },
  {
    input: 'output/worker-dom/src/index.js',
    output: {
      file: 'dist/debug.js',
      format: 'iife',
      sourcemap: true,
      name: 'WorkerThread',
      outro: 'window.workerDocument = monkey.document;',
    },
    plugins: [
      babelPlugin(false, true),
    ],
  },
];
