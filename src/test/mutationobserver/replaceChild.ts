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
import { documentForTesting as document } from '../../worker-thread/dom/Document';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';

test.cb.serial('replaceChild mutation, only node', t => {
  const div = document.createElement('div');
  const p = document.createElement('p');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
          addedNodes: [p],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(div);
  observer.observe(document.body);
  document.body.replaceChild(p, div);
});

test.cb.serial('replaceChild mutation, remove sibling node', t => {
  const div = document.createElement('div');
  const p = document.createElement('p');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [p],
          addedNodes: [div],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(div);
  document.body.appendChild(p);
  observer.observe(document.body);
  document.body.replaceChild(div, p);
});
