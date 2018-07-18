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

import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
// import { tagNameConditionPredicate, matchChildrenElements } from './matchElements';
// import { Document } from './Document';
// import { HTMLTableRowElement } from './HTMLTableRowElement';
import { reflectProperties } from './enhanceElement';

export class HTMLTextAreaElement extends HTMLElement {
  /**
   *
   */
  get type(): string {
    return 'textarea';
  }
}
registerSubclass('textarea', HTMLTextAreaElement);

// Properties Implemented on HTMLElement
// HTMLTableElement.form => HTMLFormElement, readonly

// Reflected Properties
// HTMLTableCellElement.type => string
reflectProperties([{ type: ['textarea'] }], HTMLTextAreaElement);

/*
Properties
value	string: Returns / Sets the raw value contained in the control.
textLength Read only	long: Returns the codepoint length of the control's value. Same as calling value.length
defaultValue	string: Returns / Sets the control's default value, which behaves like the Node.textContent property.
placeholder	string: Returns / Sets the element's placeholder attribute, containing a hint to the user about what to enter in the control.
rows	unsigned long: Returns / Sets the element's rows attribute, indicating the number of visible text lines for the control.
cols	unsigned long: Returns / Sets the element's cols attribute, indicating the visible width of the text area.
autofocus	boolean: Returns / Sets the element's autofocus attribute, indicating that the control should have input focus when the page loads
name	string: Returns / Sets the element's name attribute, containing the name of the control.
disabled	boolean: Returns / Sets the element's disabled attribute, indicating that the control is not available for interaction.
HTMLTextAreaElement.labelsRead only	NodeList: Returns a list of label elements associated with this select element.
maxLength	long: Returns / Sets the element's maxlength attribute, indicating the maximum number of characters the user can enter. This constraint is evaluated only when the value changes.
accessKey	string: Returns / Sets the element's accesskey attribute.
readOnly	boolean: Returns / Sets the element's readonly attribute, indicating that the user cannot modify the value of the control.
required	boolean: Returns / Sets the element's required attribute, indicating that the user must specify a value before submitting the form.
tabIndex	long: Returns / Sets the position of the element in the tabbing navigation order for the current document.
selectionStart	unsigned long: Returns / Sets the index of the beginning of selected text. If no text is selected, contains the index of the character that follows the input cursor. On being set, the control behaves as if setSelectionRange() had been called with this as the first argument, and selectionEnd as the second argument.
selectionEnd	unsigned long: Returns / Sets the index of the end of selected text. If no text is selected, contains the index of the character that follows the input cursor. On being set, the control behaves as if setSelectionRange() had been called with this as the second argument, and selectionStart as the first argument.
selectionDirection	string: Returns / Sets the direction in which selection occurred. This is "forward" if selection was performed in the start-to-end direction of the current locale, or "backward" for the opposite direction. This can also be "none" if the direction is unknown."
validity Read only	ValidityState object: Returns the validity states that this element is in.
willValidate Read only	
boolean: Returns / Sets whether the element is a candidate for constraint validation. false if any conditions bar it from constraint validation.

validationMessage Read only	string: Returns a localized message that describes the validation constraints that the control does not satisfy (if any). This is the empty string if the control is not a candidate for constraint validation (willValidate is false), or it satisfies its constraints.
autocomplete 	 
autocapitalize 	string: Returns / Sets the element's capitalization behavior for user input. Valid values are: none, off, characters, words, sentences.
inputMode 	 
wrap	string: Returns / Sets the wrap HTML attribute, indicating how the control wraps text.
*/
