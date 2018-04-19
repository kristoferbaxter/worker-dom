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