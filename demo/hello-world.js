const root = document.createElement('div');
const btn = document.createElement('button');
const text = document.createTextNode('prompt');

root.className = "root";
btn.appendChild(text);
root.appendChild(btn);

btn.addEventListener('click', () => {
  console.log('yo');
});

document.body.appendChild(root);