import test from 'ava';
import { testReflectedProperty } from '../common/reflectProperties';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLDataElement } from '../../worker-thread/dom/HTMLDataElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLDataElement(NodeType.ELEMENT_NODE, 'data', null),
  };
});

testReflectedProperty({ value: [''] });
