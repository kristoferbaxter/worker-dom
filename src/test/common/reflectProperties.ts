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

import { PropertyPair } from '../../worker-thread/dom/enhanceElement';
import test from 'ava';

export function testReflectedProperty(propertyPair: PropertyPair, alternateValue: any = null) {
  const propertyName = Object.keys(propertyPair)[0];
  const defaultValue = propertyPair[propertyName][0];
  const attributeName = propertyPair[propertyName][1] || propertyName.toLowerCase();
  let altValue = alternateValue;

  if (altValue === null) {
    switch (typeof defaultValue) {
      case 'string':
        altValue = `alt-${defaultValue || ''}`;
        break;
      case 'boolean':
        altValue = !defaultValue;
        break;
      case 'number':
        altValue = Number(defaultValue) + 1;
        break;
    }
  }

  test(`${propertyName} should be ${defaultValue} by default`, t => {
    const { element } = t.context;
    t.is(element[propertyName], defaultValue);
  });

  test(`${propertyName} should be settable to a single value`, t => {
    const { element } = t.context;
    element[propertyName] = altValue;
    t.is(element[propertyName], altValue);
  });

  test(`${propertyName} property change should be reflected in attribute`, t => {
    const { element } = t.context;
    element[propertyName] = altValue;
    t.is(element.getAttribute(attributeName), String(altValue));
  });

  test(`${propertyName} attribute change should be reflected in property`, t => {
    const { element } = t.context;
    element.setAttribute(attributeName, String(altValue));
    t.is(element[propertyName], altValue);
  });
}
