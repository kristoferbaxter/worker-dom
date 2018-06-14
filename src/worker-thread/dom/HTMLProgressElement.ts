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

import { registerSubclass, Element } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { matchChildrenElements } from './matchElements';

export class HTMLProgressElement extends HTMLElement {
  private _indeterminate: boolean = true;
  private _value: number = 0;

  get position(): number {
    return this._indeterminate ? -1 : this._value / this.max;
  }

  get value(): number {
    return this._value;
  }
  set value(value: number) {
    this._indeterminate = false;
    this._value = value;
  }

  /**
   * Getter returning label elements associated to this meter.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLProgressElement/labels
   * @return label elements associated to this meter.
   */
  get labels(): Array<Element> {
    return matchChildrenElements(
      (this.ownerDocument as Element) || this,
      element => element.tagName === 'label' && element.for && element.for === this.id,
    );
  }
}
registerSubclass('progress', HTMLProgressElement);

// Reflected Properties
// HTMLModElement.max => number, reflected attribute
reflectProperties([{ max: [1] }], HTMLProgressElement);
