import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLFieldSetElement } from '../../src/dom/HTMLFieldSetElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLFieldSetElement(NodeType.ELEMENT_NODE, 'fieldset', null),
  };
});

testReflectedProperties([{ name: [''] }, { disabled: [false] }]);
