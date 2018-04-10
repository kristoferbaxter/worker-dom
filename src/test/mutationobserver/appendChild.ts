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

test.cb.serial('appendChild mutation observed, first node', t => {
  const div = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.CHILD_LIST,
        target: document.body,
        addedNodes: [div],
        previousSibling: undefined,
      },
    ]);
    observer.disconnect();
    t.end();
  });

  observer.observe(document.body);
  document.body.appendChild(div);
});

// TODO(KB): Tests must be run serially, observer callbacks are not occuring otherwise.
test.cb.serial('appendChild mutation observed, sibling node', t => {
  const div = document.createElement('div');
  const p = document.createElement('p');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.CHILD_LIST,
        target: document.body,
        addedNodes: [p],
        previousSibling: div,
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(div);
  observer.observe(document.body);
  document.body.appendChild(p);
});

test.cb.serial('appendChild mutation observed, tree > 1 depth', t => {
  const div = document.createElement('div');
  const p = document.createElement('p');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.CHILD_LIST,
        target: div,
        addedNodes: [p],
        previousSibling: undefined,
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(div);
  observer.observe(document.body);
  div.appendChild(p);
});
