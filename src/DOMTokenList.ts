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

import { Element } from './Element';

export class DOMTokenList extends Array {
  element: Element;
  attributeName: string;
  attributeNamespace: string | null = null;

  constructor(element: Element, attributeName: string, attributeNamespace: string | null) {
    super();
    this.element = element;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value
   * @return string representation of tokens (space delimitted).
   */
  get value(): string {
    return this.join(' ');
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value
   * @param collection String of values space delimited to replace the current DOMTokenList with.
   */
  set value(collection: string) {
    // TODO(KB): Restore mutation observation
    // const oldValue = this.value;
    const newValue = collection.trim();

    // Replace current tokens with new tokens.
    this.splice(0, this.length, ...newValue.split(/\s+/));

    // TODO(KB): Restore mutation observation
    // this.mutate(this, 'attributes', {
    //   attributeName: this.attributeName,
    //   attributeNamespace: this.attributeNamespace,
    //   value: newValue,
    //   oldValue,
    // });
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item
   * @param index number from DOMTokenList entities to retrieve value of
   * @return value stored at the index requested, or undefined if beyond known range.
   */
  public item(index: number): string | undefined {
    return this[index];
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains
   * @param token token value the DOMTokenList is tested for.
   * @return boolean indicating if the token is contained by the DOMTokenList.
   */
  public contains(token: string): boolean {
    return this.indexOf(token) >= 0;
  }

  /**
   * Add a token or tokens to the list.
   * Note: All duplicates are removed, and the first token's position with the value is preserved.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add
   * @param tokens each token is a string to add to a TokenList.
   */
  public add(...tokens: string[]): void {
    // TODO(KB): Restore mutation observation
    // const oldValue = this.value;
    this.splice(0, this.length, ...new Set(this.concat(tokens)));

    // TODO(KB): Restore mutation observation
    // this.mutate(this, 'attributes', {
    //   attributeName: this.attributeName,
    //   attributeNamespace: this.attributeNamespace,
    //   value: this.value,
    //   oldValue,
    // });
  }

  /**
   * Remove a token or tokens from the list.
   * Note: All duplicates are removed, and the first token's position with the value is preserved.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove
   * @param tokens each token is a string to remove from a TokenList.
   */
  public remove(...tokens: string[]): void {
    // TODO(KB): Restore mutation observation
    // const oldValue = this.value;
    this.splice(0, this.length, ...new Set(this.filter(token => tokens.indexOf(token) === -1)));

    // TODO(KB): Restore mutation observation
    // this.mutate(this, 'attributes', {
    //   attributeName: this.attributeName,
    //   attributeNamespace: this.attributeNamespace,
    //   value: this.value,
    //   oldValue,
    // });
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace
   * @param token
   * @param newToken
   */
  public replace(token: string, newToken: string): void {
    const index = this.indexOf(token);

    if (index < 0) {
      return;
    }

    // TODO(KB): Restore mutation observation
    // const oldValue = this.value;
    let set = new Set(this); // foo foo bar
    if (token !== newToken) {
      set.delete(token);
      if (newToken !== '') {
        set.add(newToken);
      }
    }
    this.splice(0, this.length, ...set);

    // TODO(KB): Restore mutation observation
    // this.mutate(this, 'attributes', {
    //   attributeName: this.attributeName,
    //   attributeNamespace: this.attributeNamespace,
    //   value: this.value,
    //   oldValue,
    // });
  }

  /**
   * Adds or removes a token based on its presence in the token list.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle
   * @param token string to add or remove from the token list
   * @param force NOT CURRENTLY IMPLEMENTED
   * @return true if the token is in the list following mutation, false if not.
   */
  public toggle(token: string, force?: boolean): boolean {
    if (this.indexOf(token) < 0) {
      this.add(token);
      return true;
    }
    this.remove(token);
    return false;
  }
}
