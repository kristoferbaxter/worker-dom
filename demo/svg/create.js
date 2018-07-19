const btn = document.createElement('button');
btn.textContent = 'Add SVG';

btn.addEventListener('click', () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  document.body.appendChild(svg);
});

document.body.appendChild(btn);

