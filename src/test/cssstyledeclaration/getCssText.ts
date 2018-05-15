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

test.serial('cssText dasherizes only capitals after lowercase letters', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  appendKeys(['linebreakFoo']);
  declaration.linebreakFoo = 'normal';
  t.is(declaration.cssText, 'linebreak-foo: normal;');
});

test.serial('cssText contains multiple mutated properties', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  appendKeys(['height', 'position']);
  declaration.height = '100px';
  declaration.position = 'absolute';
  t.is(declaration.cssText, 'height: 100px; position: absolute;');
});

test.serial('cssText contains webkit vendor prefixed property', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  appendKeys(['webkitLineBreak']);
  declaration.webkitLineBreak = 'normal';
  t.is(declaration.cssText, '-webkit-line-break: normal;');
});

test.serial('cssText contains ms vendor prefixed property', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  appendKeys(['msLineBreak']);
  declaration.msLineBreak = 'normal';
  t.is(declaration.cssText, '-ms-line-break: normal;');
});

test.serial('cssText contains moz vendor prefixed propertiy', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  appendKeys(['mozLineBreak']);
  declaration.mozLineBreak = 'normal';
  t.is(declaration.cssText, '-moz-line-break: normal;');
});

test.serial('cssText contains khtml vendor prefixed propertiy', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  appendKeys(['khtmlLineBreak']);
  declaration.khtmlLineBreak = 'normal';
  t.is(declaration.cssText, '-khtml-line-break: normal;');
});

test.serial('cssText does not prefix dasherize keys containing vendor prefixes not in the first position', t => {
  const declaration = Object.create(CSSStyleDeclaration);

  appendKeys(['lineKhtmlBreak']);
  declaration.lineKhtmlBreak = 'normal';
  t.is(declaration.cssText, 'line-khtml-break: normal;');
});
