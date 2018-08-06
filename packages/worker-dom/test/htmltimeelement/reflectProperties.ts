import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLTimeElement } from '../../worker-thread/dom/HTMLTimeElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLTimeElement(NodeType.ELEMENT_NODE, 'time', null),
  };
});

testReflectedProperties([{ dateTime: [''] }]);
