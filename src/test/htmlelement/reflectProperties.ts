import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLElement(NodeType.ELEMENT_NODE, 'form', null),
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
