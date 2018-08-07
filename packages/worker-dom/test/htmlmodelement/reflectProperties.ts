import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLModElement } from '../../src/dom/HTMLModElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLModElement(NodeType.ELEMENT_NODE, 'del', null),
  };
});

testReflectedProperties([{ cite: [''] }, { datetime: [''] }]);
