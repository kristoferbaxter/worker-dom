import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLIFrameElement } from '../../src/dom/HTMLIFrameElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLIFrameElement(NodeType.ELEMENT_NODE, 'iframe', null),
  };
});

testReflectedProperties([
  { allow: [''] },
  { allowFullscreen: [false] },
  { csp: [''] },
  { height: [''] },
  { name: [''] },
  { referrerPolicy: [''] },
  { src: [''] },
  { srcdoc: [''] },
  { width: [''] },
]);
