import test from 'ava';
import { testReflectedProperty } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLButtonElement } from '../../worker-thread/dom/HTMLButtonElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLButtonElement(NodeType.ELEMENT_NODE, 'button', null),
  };
});

testReflectedProperty({ disabled: [false] });
testReflectedProperty({ formAction: [''] }, 'hello');
testReflectedProperty({ formEnctype: [''] });
testReflectedProperty({ formMethod: [''] });
testReflectedProperty({ formTarget: [''] });
testReflectedProperty({ name: [''] });
testReflectedProperty({ type: ['submit'] });
testReflectedProperty({ value: [''] });
testReflectedProperty({ autofocus: [false] });
