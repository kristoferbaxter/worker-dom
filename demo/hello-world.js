const root = document.createElement('div');
const btn = document.createElement('button');
const text = document.createTextNode('prompt');

root.className = "root";
btn.appendChild(text);
root.appendChild(btn);

btn.addEventListener('click', () => {
  const heading = document.createElement('h1');
  heading.textContent = 'Hello World';
  root.appendChild(heading);
});

document.body.appendChild(root);