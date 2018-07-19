import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLSelectElement } from '../../worker-thread/dom/HTMLSelectElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLSelectElement(NodeType.ELEMENT_NODE, 'select', null),
  };
});

testReflectedProperties([{ multiple: [false] }, { name: [''] }, { required: [false] }]);
