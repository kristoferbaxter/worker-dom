import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLMeterElement } from '../../worker-thread/dom/HTMLMeterElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLMeterElement(NodeType.ELEMENT_NODE, 'meter', null),
  };
});

testReflectedProperties([{ high: [0] }, { low: [0] }, { max: [1] }, { min: [0] }, { optimum: [0] }, { value: [0] }]);
