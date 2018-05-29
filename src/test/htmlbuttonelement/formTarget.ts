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
import { HTMLButtonElement } from '../../worker-thread/HTMLButtonElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLButtonElement(NodeType.ELEMENT_NODE, 'button', null),
  };
});

test('formTarget should be empty by default', t => {
  const { element } = t.context as { element: HTMLButtonElement };

  t.is(element.formTarget, '');
});

test('formTarget should be settable to a single value', t => {
  const { element } = t.context as { element: HTMLButtonElement };

  element.formTarget = '_blank';
  t.is(element.formTarget, '_blank');
});

test('formTarget should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLButtonElement };

  element.formTarget = '_blank';
  t.is(element.getAttribute('formtarget'), '_blank');
});

test('formTarget should be reflected in property', t => {
  const { element } = t.context as { element: HTMLButtonElement };

  element.setAttribute('formtarget', '_blank');
  t.is(element.formTarget, '_blank');
});
