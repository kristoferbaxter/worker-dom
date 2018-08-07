import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLTimeElement } from '../../src/dom/HTMLTimeElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLTimeElement(NodeType.ELEMENT_NODE, 'time', null),
  };
});

testReflectedProperties([{ dateTime: [''] }]);
