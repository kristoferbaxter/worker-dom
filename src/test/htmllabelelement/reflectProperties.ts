import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLLabelElement } from '../../worker-thread/dom/HTMLLabelElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLLabelElement(NodeType.ELEMENT_NODE, 'label', null),
  };
});

testReflectedProperties([{ htmlFor: ['', 'for'] }]);
