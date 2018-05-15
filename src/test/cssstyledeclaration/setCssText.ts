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

test.serial('setting cssText to empty from empty', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  t.is(declaration.cssText, '');
  declaration.cssText = '';
  t.is(declaration.cssText, '');
});

test.serial('setting cssText to empty removes stored values', t => {
  const declaration = Object.create(CSSStyleDeclaration);
  appendKeys(['width']);
  declaration.width = '10px';

  t.is(declaration.width, '10px');
  declaration.cssText = '';
  t.is(declaration.width, '');
});

test.serial('setting cssText to empty makes cssText empty', t => {
  const declaration = Object.create(CSSStyleDeclaration);
  appendKeys(['width']);
  declaration.width = '10px';

  t.is(declaration.cssText, 'width: 10px;');
  declaration.cssText = '';
  t.is(declaration.cssText, '');
});

test.serial('setting cssText with a value stores the value', t => {
  const declaration = Object.create(CSSStyleDeclaration);
  appendKeys(['width']);

  t.is(declaration.cssText, '');
  declaration.cssText = 'width: 10px;';
  t.is(declaration.width, '10px');
});

test.serial('setting cssText with multiple values stores the values', t => {
  const declaration = Object.create(CSSStyleDeclaration);
  appendKeys(['width', 'height']);

  t.is(declaration.cssText, '');
  declaration.cssText = 'width: 10px; height: 12px;';
  t.is(declaration.width, '10px');
  t.is(declaration.height, '12px');
});

test.failing.serial('setting cssText with a single value requiring key conversion', t => {
  const declaration = Object.create(CSSStyleDeclaration);
  appendKeys(['lineHeight']);

  t.is(declaration.cssText, '');
  declaration.cssText = 'line-height: 10px';
  t.is(declaration.lineHeight, '10px');
});
