import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLProgressElement } from '../../worker-thread/dom/HTMLProgressElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLProgressElement(NodeType.ELEMENT_NODE, 'progress', null),
  };
});

testReflectedProperties([{ max: [1] }]);
