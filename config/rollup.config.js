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

import { plugins } from './rollup.plugins.js';
import { output } from './rollup.output.js';

const config = ({ esmodules, forMainThread }) => {
  const inputFilename = 'index.js';
  const threadFoldername = forMainThread ? 'main-thread' : 'worker-thread';

  return {
    input: `src/output/${threadFoldername}/${inputFilename}`,
    output: output(esmodules, forMainThread),
    plugins: plugins(esmodules),
  };
};

export default [
  config({ esmodules: false, forMainThread: false }),
  config({ esmodules: true, forMainThread: false }),
  config({ esmodules: false, forMainThread: true }),
  config({ esmodules: true, forMainThread: true }),
];
