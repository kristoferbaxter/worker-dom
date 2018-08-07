import test from 'ava';
import { testReflectedProperty } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLDataElement } from '../../src/dom/HTMLDataElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLDataElement(NodeType.ELEMENT_NODE, 'data', null),
  };
});

testReflectedProperty({ value: [''] });
