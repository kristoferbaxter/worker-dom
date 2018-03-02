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
import {Node} from '../Node';
import {Event} from '../Event';

test.beforeEach(t => {
  t.context.node = new Node();
});

test('Node.dispatchEvent calls handler functions registered with addEventListener', t => {
  t.plan(2);

  t.context.node.addEventListener('click', (event: Event) => {
    t.pass();
  });

  const event = new Event('click', {});
  event.target = t.context.node;
  t.true(t.context.node.dispatchEvent(event));
});

test('Node.dispatchEvent does not call handler functions removed with removeEventListener', t => {
  const functionRemoved = (event: Event) => t.fail('removeEventListener function handler was called');
  t.context.node.addEventListener('click', functionRemoved);
  t.context.node.removeEventListener('click', functionRemoved);

  const event = new Event('click', {});
  event.target = t.context.node;
  t.true(t.context.node.dispatchEvent(event));
});

test('Node.dispatchEvent calls handler functions for only the specified type of event', t => {
  t.plan(2);

  t.context.node.addEventListener('click', (event: Event) => {
    t.is(event.type, 'click', 'event type is correct');
  });
  t.context.node.addEventListener('foo', (event: Event) => {
    t.fail('handler for the incorrect type was called');
  });

  const event = new Event('click', {});
  event.target = t.context.node;
  t.true(t.context.node.dispatchEvent(event));
});

test('Node.dispatchEvent does not call handler functions for unspecified event types', t => {
  t.context.node.addEventListener('foo', (event: Event) => {
    t.fail('handler for the incorrect type was called');
  });

  const event = new Event('click', {});
  event.target = t.context.node;
  t.true(t.context.node.dispatchEvent(event));
});

test('Node.dispatchEvent calls handler functions with the correct event.target', t => {
  t.plan(2);
  
  t.context.node.addEventListener('click', (event: Event) => {
    t.deepEqual(event.target, t.context.node, 'event target is the node the event was dispatched from.'); 
  });

  const event: Event = new Event('click', {});
  event.target = t.context.node;
  t.true(t.context.node.dispatchEvent(event));
});
