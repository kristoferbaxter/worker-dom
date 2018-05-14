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

test.serial('appending keys mutates a declaration instance', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  t.is(declaration.width, undefined);
  appendKeys(['width']);
  t.is(declaration.width, '');
});

test.serial('appending keys mutates all known declaration instances', t => {
  const firstDeclaration = Object.create(CSSStyleDeclaration);
  const secondDeclaration = Object.create(CSSStyleDeclaration);

  t.is(firstDeclaration.height, undefined);
  t.is(secondDeclaration.height, undefined);
  appendKeys(['height']);
  t.is(firstDeclaration.height, '');
  t.is(secondDeclaration.height, '');
});

test.serial('previously appended keys should exist on newly declared instances', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  t.is(declaration.width, '');
  t.is(declaration.height, '');
});
