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

type BufferSource = ArrayBufferView | ArrayBuffer;

interface TextDecodeOptions {
  stream?: boolean;
}

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

interface TextDecoder {
  readonly encoding: string;
  readonly fatal: boolean;
  readonly ignoreBOM: boolean;
  decode(input?: BufferSource, options?: TextDecodeOptions): string;
}

interface TextEncoder {
  readonly encoding: string;
  encode(input?: string): Uint8Array;
}

declare var TextDecoder: {
  prototype: TextDecoder;
  new (label?: string, options?: TextDecoderOptions): TextDecoder;
};

declare var TextEncoder: {
  prototype: TextEncoder;
  new (): TextEncoder;
};

class PolyfillEncoder implements TextEncoder {
  public readonly encoding: string = 'utf-8';
  public encode(input?: string): Uint8Array {
    if (input !== undefined) {
      return this.stringToBytes(unescape(encodeURIComponent(input)));
    }
    return new Uint8Array();
  }

  /**
   * Converts a string which holds 8-bit code points, such as the result of atob,
   * into a Uint8Array with the corresponding bytes.
   * If you have a string of characters, you probably want to be using utf8Encode.
   * @param {string} str
   * @return {!Uint8Array}
   */
  private stringToBytes(str: string): Uint8Array {
    const bytes = new Uint8Array(str.length);
    const length = str.length;
    for (let iterator = 0; iterator < length; iterator++) {
      const charCode = str.charCodeAt(iterator);
      bytes[iterator] = charCode;
    }
    return bytes;
  }
}

class PolyfillDecoder implements TextDecoder {
  public readonly encoding: string = 'utf-8';
  public readonly fatal: boolean = false;
  public readonly ignoreBOM: boolean = false;

  public decode(input?: BufferSource, options?: TextDecodeOptions): string {
    const asciiString = this.bytesToString(new Uint8Array(input as ArrayBufferLike, 0));
    return decodeURIComponent(escape(asciiString));
  }

  /**
   * Converts a 8-bit bytes array into a string
   * @param {!Uint8Array} bytes
   * @return {string}
   */
  private bytesToString(bytes: Uint8Array): string {
    // Intentionally avoids String.fromCharCode.apply so we don't suffer a
    // stack overflow. #10495, https://jsperf.com/bytesToString-2
    const length = bytes.length;
    const array = new Array(length);
    for (let i = 0; i < length; i++) {
      array[i] = String.fromCharCode(bytes[i]);
    }
    return array.join('');
  }
}

export const ENCODER = typeof TextEncoder !== 'undefined' ? new TextEncoder() : new PolyfillEncoder();
export const DECODER = typeof TextDecoder !== 'undefined' ? new TextDecoder() : new PolyfillDecoder();

console.log(`encoder is`, typeof TextEncoder !== 'undefined' ? 'native' : 'polyfilled');
