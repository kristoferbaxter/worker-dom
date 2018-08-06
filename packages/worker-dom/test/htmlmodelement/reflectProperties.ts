import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLModElement } from '../../worker-thread/dom/HTMLModElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLModElement(NodeType.ELEMENT_NODE, 'del', null),
  };
});

testReflectedProperties([{ cite: [''] }, { datetime: [''] }]);
