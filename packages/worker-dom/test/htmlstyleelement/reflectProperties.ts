import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLStyleElement } from '../../worker-thread/dom/HTMLStyleElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLStyleElement(NodeType.ELEMENT_NODE, 'style', null),
  };
});

testReflectedProperties([{ media: [''] }, { type: [''] }]);
