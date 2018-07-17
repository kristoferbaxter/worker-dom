import test from 'ava';
import { testReflectedProperties } from '../common/reflectProperties';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLFieldSetElement } from '../../worker-thread/dom/HTMLFieldSetElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLFieldSetElement(NodeType.ELEMENT_NODE, 'fieldset', null),
  };
});

testReflectedProperties([{ name: [''] }, { disabled: [false] }]);
