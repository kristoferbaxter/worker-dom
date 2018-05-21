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
import { NodeType } from '../../worker-thread/Node';
import { Element } from '../../worker-thread/Element';
import { DOMTokenList } from '../../worker-thread/DOMTokenList';

test('getter should be empty by default', t => {
  const tokenList = new DOMTokenList(new Element(NodeType.ELEMENT_NODE, 'div', null), 'class', null, () => {});

  t.is(tokenList.value, '');
});

test('should accept new total values via setter', t => {
  const tokenList = new DOMTokenList(new Element(NodeType.ELEMENT_NODE, 'div', null), 'class', null, () => {});

  tokenList.value = 'foo';
  t.is(tokenList.value, 'foo');
  tokenList.value = 'foo bar baz';
  t.is(tokenList.value, 'foo bar baz');
  tokenList.value = 'foo foo bar baz foo baz bar';
  t.is(tokenList.value, 'foo foo bar baz foo baz bar', 'duplicates are allowed and their position is retained');
});

test.cb('provided callback is fired when value changes', t => {
  const tokenList = new DOMTokenList(new Element(NodeType.ELEMENT_NODE, 'div', null), 'class', null, (namespaceURI, name, value) => {
    t.is(namespaceURI, null);
    t.is(name, 'class');
    t.is(value, 'foo');
    t.end();
  });

  tokenList.value = 'foo';
});
