import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLLabelElement } from '../../src/dom/HTMLLabelElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLLabelElement(NodeType.ELEMENT_NODE, 'label', null),
  };
});

testReflectedProperties([{ htmlFor: ['', 'for'] }]);
