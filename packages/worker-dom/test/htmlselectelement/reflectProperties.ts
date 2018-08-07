import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLSelectElement } from '../../src/dom/HTMLSelectElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLSelectElement(NodeType.ELEMENT_NODE, 'select', null),
  };
});

testReflectedProperties([{ multiple: [false] }, { name: [''] }, { required: [false] }]);
