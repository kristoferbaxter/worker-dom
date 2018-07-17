import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLMapElement } from '../../worker-thread/dom/HTMLMapElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLMapElement(NodeType.ELEMENT_NODE, 'map', null),
  };
});

testReflectedProperties([{ name: [''] }]);
