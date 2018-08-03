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

import babel from 'rollup-plugin-babel';
import minify from '@ampproject/rollup-plugin-closure-compiler';
import brotli from 'rollup-plugin-brotli';
import gzip from 'rollup-plugin-gzip';
import { path, DEBUG_BUNDLE_VALUE, SANITIZE_MUTATIONS_VALUE } from './rollup.utils.js';

const BROTLI_CONFIG = {
  options: {
    mode: 0,
    quality: 11,
    lgwin: 22,
    lgblock: 0,
    disable_literal_context_modeling: false,
    size_hint: 0,
    large_window: false,
    npostfix: 0,
    ndirect: 0,
  },
  minSize: 0,
};
const GZIP_CONFIG = {
  algorithm: 'zopfli',
  options: {
    numiterations: 1000,
  },
};

export const babelPlugin = (esmodules, withSanitizer) => {
  const targets = esmodules ? { esmodules: true } : { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'] };
  const exclude = DEBUG_BUNDLE_VALUE ? ['error', 'warn', 'info', 'log', 'time', 'timeEnd'] : [];

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
      ['babel-plugin-transform-remove-console', { exclude }],
      [
        'minify-replace',
        {
          replacements: [
            {
              identifierName: '__WORKER_DOM_URL__',
              replacement: {
                type: 'stringLiteral',
                value: path(esmodules, false, withSanitizer, 'index'),
              },
            },
            {
              identifierName: '__SANITIZE_MUTATIONS__',
              replacement: {
                type: 'booleanLiteral',
                value: withSanitizer,
              },
            },
          ],
        },
      ],
    ],
  });
};
export const minifyPlugin = _ => minify();
export const brotliPlugin = _ => brotli(BROTLI_CONFIG);
export const gzipPlugin = _ => gzip(GZIP_CONFIG);
