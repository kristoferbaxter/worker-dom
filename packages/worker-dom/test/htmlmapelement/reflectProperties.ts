import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLMapElement } from '../../src/dom/HTMLMapElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLMapElement(NodeType.ELEMENT_NODE, 'map', null),
  };
});

testReflectedProperties([{ name: [''] }]);
