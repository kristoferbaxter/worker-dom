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
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLImageElement } from '../../worker-thread/dom/HTMLImageElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLImageElement(NodeType.ELEMENT_NODE, 'img', null),
  };
});

test('srcset should be empty by default', t => {
  const { element } = t.context as { element: HTMLImageElement };

  t.is(element.srcset, '');
});

test('srcset should be settable to a string value', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.srcset = 'image-1x.png 1x, image-2x.png 2x, image-3x.png 3x, image-4x.png 4x';
  t.is(element.srcset, 'image-1x.png 1x, image-2x.png 2x, image-3x.png 3x, image-4x.png 4x');
});

test('srcset property change should be reflected in attribute', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.srcset = 'image-1x.png 1x, image-2x.png 2x, image-3x.png 3x, image-4x.png 4x';
  t.is(element.getAttribute('srcset'), 'image-1x.png 1x, image-2x.png 2x, image-3x.png 3x, image-4x.png 4x');
});

test('srcset attribute change should be reflected in property', t => {
  const { element } = t.context as { element: HTMLImageElement };

  element.setAttribute('srcset', 'image-1x.png 1x, image-2x.png 2x, image-3x.png 3x, image-4x.png 4x');
  t.is(element.srcset, 'image-1x.png 1x, image-2x.png 2x, image-3x.png 3x, image-4x.png 4x');
});
