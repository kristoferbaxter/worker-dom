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
import { document } from '../../worker-thread/index';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';

test.cb('Element.classList.set mutation observed', t => {
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'class',
        attributeNamespace: null,
        target: el,
        value: 'foo bar',
        oldValue: '',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  observer.observe(document.body);
  el.classList.value = 'foo bar';
});
