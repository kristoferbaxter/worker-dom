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
import uglify from 'rollup-plugin-uglify';
import brotli from 'rollup-plugin-brotli';
import gzip from "rollup-plugin-gzip";
import { path, UGLIFY_BUNDLE_VALUE, DEBUG_BUNDLE_VALUE, COMPRESS_BUNDLE_VALUE } from './rollup.utils.js';

const excludeFromConsoleRemoval = DEBUG_BUNDLE_VALUE ? ['error', 'warn', 'info', 'log'] : [];
const targets = esmodules => esmodules ? { esmodules: true } : { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'] };
const babelConfiguration = esmodules => {
  return {
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/env',
        {
          targets: targets(esmodules),
          loose: true,
          modules: false,
        },
      ],
    ],
    plugins: [
      ['@babel/plugin-proposal-object-rest-spread'],
      ['@babel/proposal-class-properties'],
      ['babel-plugin-transform-remove-console', { exclude: excludeFromConsoleRemoval }],
      [
        'minify-replace',
        {
          replacements: [
            {
              identifierName: '__WORKER_DOM_URL__',
              replacement: {
                type: 'stringLiteral',
                value: path(esmodules, false, 'index.js'),
              },
            },
          ],
        },
      ],
    ],
  };
}
const brotliConfiguration = {
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
  minSize: 0
};
const gzipConfiguration = {
  algorithm: 'zopfli',
  options: {
    numiterations: 1000,
  }
}

/**
 * @param {boolean} esmodules
 * @returns {Array<Plugin>}
 */
export function plugins(esmodules) {
  let plugins = [babel(babelConfiguration(esmodules))];

  if (UGLIFY_BUNDLE_VALUE) {
    plugins.push(uglify());
  }
  if (COMPRESS_BUNDLE_VALUE) {
    plugins.push(brotli(brotliConfiguration), gzip(gzipConfiguration));
  }

  return plugins;
}
