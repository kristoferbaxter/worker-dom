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

import { ENCODER } from './Encoding';
import { Opcode } from './Opcode';

const UINT8_BYTES_PER_ELEMENT = 1;
const UINT32_BYTES_PER_ELEMENT = 4;
const DEFAULT_STORE_LENGTH = 20000;
const STORE_LENGTH_MULTIPLIER = 1.5;

export class Transferable {
  private length: number;
  private store: Uint8Array;
  private offset: number;
  private view: DataView;

  constructor() {
    this.reset();
  }

  private reset(length: number = DEFAULT_STORE_LENGTH, offset: number = 0, prefix?: Uint8Array) {
    this.length = length;
    this.store = new Uint8Array(length);
    if (prefix !== undefined) {
      this.store.set(prefix, 0);
    }
    this.offset = offset;
    this.view = new DataView(this.store.buffer);
  }

  private resize(newOffset: number) {
    if (newOffset + UINT8_BYTES_PER_ELEMENT >= this.length) {
      // If the new size is greater than what the current store can hold
      // [...values, Opcode.END], then we need a larger store for this message.

      this.reset(newOffset * STORE_LENGTH_MULTIPLIER, this.offset, this.store);
    }
  }

  public consume(): Uint8Array {
    const hold = this.store;
    this.reset();
    return hold;
  }

  public appendOpcode(value?: Opcode | number) {
    if (value) {
      this.view.setUint8(this.offset, value);
      this.offset += UINT8_BYTES_PER_ELEMENT;
    }
  }

  public appendNumber(value?: number) {
    this.appendOpcode(value);
  }

  public appendNumbers(values: Array<Opcode | number>, openOpcode?: Opcode, closeOpcode?: Opcode) {
    this.appendOpcode(openOpcode);
    this.store.set(values, this.offset);
    this.offset += UINT8_BYTES_PER_ELEMENT * values.length;
    this.appendOpcode(closeOpcode);
  }

  public appendString(toAppend: string, openOpcode?: Opcode, closeOpcode?: Opcode) {
    const encoded: Uint8Array = ENCODER.encode(toAppend);
    const totalBytes = UINT32_BYTES_PER_ELEMENT + encoded.byteLength;

    this.resize(this.offset + totalBytes);
    this.appendOpcode(openOpcode);
    this.view.setUint32(this.offset, encoded.byteLength);
    this.store.set(encoded, this.offset + UINT32_BYTES_PER_ELEMENT);
    this.offset += totalBytes;
    this.appendOpcode(closeOpcode);
  }

  public appendStrings(toAppend: Array<string>, openOpcode?: Opcode, closeOpcode?: Opcode) {
    this.appendOpcode(openOpcode);
    toAppend.forEach(value => this.appendString(value));
    this.appendOpcode(closeOpcode);
  }

  public appendStore(toAppend: Uint8Array) {
    this.store.set(toAppend, this.offset);
    this.offset += toAppend.byteLength;
  }
}
