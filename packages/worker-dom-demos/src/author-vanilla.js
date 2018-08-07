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

const div = document.createElement('div');
const text = document.createTextNode('Hello World!');
const span = document.createElement('span');
const spanText = document.createTextNode('spaner');
const input = document.createElement('input');

input.value = '';

div.appendChild(text);
span.appendChild(spanText);
div.appendChild(span);
div.appendChild(input);
document.body.appendChild(div);

function toggle() {
  span.classList.toggle('clicked');
  div.style.color = div.style.color === "green" ? "red" : "green";
}

span.addEventListener('click', toggle, false);

input.value = 'foo';

input.addEventListener('input', event => {
  if (/foo/.test(event.currentTarget.value)) {
    toggle();
  } else if (/bar/.test(event.currentTarget.value)) {
    span.remove();
  }
}, false);

// span.addEventListener('click', function handleClick() {
//   span.textContent = JSON.stringify(span.getBoundingClientRect());
// }, false);

// span.addEventListener('click', function handleClick() {
//   span.textContent = JSON.stringify(span.getAsyncBoundingClientRect());
// }, false);

// setInterval(toggle, 600);