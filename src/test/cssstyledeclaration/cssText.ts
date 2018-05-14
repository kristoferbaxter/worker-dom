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

import test from 'ava';
import { CSSStyleDeclaration, appendKeys } from '../../worker-thread/CSSStyleDeclaration';

test.serial('cssText is empty by default', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  t.is(declaration.cssText, '');
});

test.serial('cssText contains single mutated property', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  appendKeys(['width']);
  declaration.width = '100px';
  t.is(declaration.cssText, 'width: 100px;');
});
