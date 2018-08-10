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

/**
 * Invoke Babel on source, with some configuration.
 * @param {object} config, two keys transpileToES5, and allowConsole 
 * - transpileToES5 Should we transpile down to ES5 or features supported by `module` capable browsers?
 * - allowConsole Should we allow `console` methods in the output?
 */
export function babelPlugin({transpileToES5, allowConsole = false}) {
  const targets = transpileToES5 ? { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'] } : { esmodules: true };
  const exclude = allowConsole ? ['error', 'warn', 'info', 'log', 'time', 'timeEnd'] : [];

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
      // ['babel-plugin-transform-remove-console', { exclude }],
    ],
  });
};
