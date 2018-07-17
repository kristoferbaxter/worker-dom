import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLOptionElement(NodeType.ELEMENT_NODE, 'label', null),
  };
});

testReflectedProperties([{ defaultSelected: [false, 'selected'] }, { disabled: [false] }, { type: [''] }]);
