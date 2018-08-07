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
import { document } from '../../src/dom/Document';
import { MutationRecord } from '../../src/MutationRecord';
import { appendKeys } from '../../src/css/CSSStyleDeclaration';
import { MutationRecordType } from '@ampproject/worker-dom-transport/src/TransferrableRecord';

test.cb.serial('Element.style.width mutation observed, single value', t => {
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: 'width: 12px;',
          oldValue: 'width: 10px;',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.width = '10px';
  observer.observe(document.body);
  el.style.width = '12px';
});

test.cb.serial('Element.style.width mutation observed, multiple values', t => {
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: 'width: 14px; height: 12px;',
          oldValue: 'width: 10px; height: 12px;',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  appendKeys(['width', 'height']);
  el.style.width = '10px';
  el.style.height = '12px';
  observer.observe(document.body);
  el.style.width = '14px';
});

test.cb.serial('Element.style.width mutation observed, single value, setProperty', t => {
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',
          target: el,
          value: 'width: 12px;',
          oldValue: 'width: 10px;',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.setProperty('width', '10px');
  observer.observe(document.body);
  el.style.setProperty('width', '12px');
});

test.cb.serial('Element.style.width mutation observed, multiple values, via cssText', t => {
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',
          target: el,
          value: 'width: 12px; height: 14px;',
          oldValue: 'width: 10px; height: 12px;',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  appendKeys(['width', 'height']);
  el.style.cssText = 'width: 10px; height: 12px';
  observer.observe(document.body);
  el.style.cssText = 'width: 12px; height: 14px';
});
