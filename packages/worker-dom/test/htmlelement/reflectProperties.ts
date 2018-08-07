import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLElement } from '../../src/dom/HTMLElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLElement(NodeType.ELEMENT_NODE, 'div', null),
  };
});

testReflectedProperties([
  { accessKey: [''] },
  { contentEditable: ['inherit'] },
  { dir: [''] },
  { lang: [''] },
  { title: [''] },
  { draggable: [false] },
  { hidden: [false] },
  { noModule: [false] },
  { spellcheck: [true] },
  { translate: [true] },
]);