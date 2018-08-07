const root = document.createElement('div');
const btn = document.createElement('button');
const text = document.createTextNode('Insert Hello World!');

root.className = "root";
btn.appendChild(text);
root.appendChild(btn);

btn.addEventListener('click', () => {
  const h1 = document.createElement('h1');
  h1.textContent = 'Hello World!'
  document.body.appendChild(h1);
});

document.body.appendChild(root);