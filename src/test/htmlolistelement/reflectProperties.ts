import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLOListElement } from '../../worker-thread/dom/HTMLOListElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLOListElement(NodeType.ELEMENT_NODE, 'ol', null),
  };
});

testReflectedProperties([{ reversed: [false] }, { start: [1] }, { type: [''] }]);
