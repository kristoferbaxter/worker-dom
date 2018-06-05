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

import { reflectProperties, registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { HTMLFormControlsCollectionMixin } from './HTMLFormControlsMixin';

export class HTMLFormElement extends HTMLElement {}
registerSubclass('form', HTMLFormElement);
HTMLFormControlsCollectionMixin(HTMLFormElement);

// Reflected properties
// HTMLFormElement.name => string, reflected attribute
// HTMLFormElement.method => string, reflected attribute
// HTMLFormElement.target => string, reflected attribute
// HTMLFormElement.action => string, reflected attribute
// HTMLFormElement.enctype => string, reflected attribute
// HTMLFormElement.acceptCharset => string, reflected attribute
// HTMLFormElement.autocomplete => string, reflected attribute
reflectProperties(
  [{ name: '' }, { method: '' }, { target: '' }, { action: '' }, { enctype: '' }, { acceptCharset: '' }, { autocomplete: '' }],
  HTMLFormElement,
);

// Unimplemented properties
// HTMLFormElement.encoding => string, reflected attribute
// HTMLFormElement.noValidate => boolean, reflected attribute

/*
HTMLFormElement.elements Read only
A HTMLFormControlsCollection holding all form controls belonging to this form element.
HTMLFormElement.lengthRead only
A long reflecting the number of controls in the form.

Named inputs are added to their owner form instance as properties, and can overwrite native properties if they share the same name (eg a form with an input named action will have its action property return that input instead of the form's action HTML attribute).
*/
