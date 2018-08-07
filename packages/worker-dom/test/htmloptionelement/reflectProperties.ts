import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLOptionElement } from '../../src/dom/HTMLOptionElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLOptionElement(NodeType.ELEMENT_NODE, 'option', null),
  };
});

testReflectedProperties([{ defaultSelected: [false, 'selected'] }, { disabled: [false] }, { type: [''] }]);
