import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLStyleElement } from '../../src/dom/HTMLStyleElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLStyleElement(NodeType.ELEMENT_NODE, 'style', null),
  };
});

testReflectedProperties([{ media: [''] }, { type: [''] }]);
