import test from 'ava';
import { testReflectedProperty } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLButtonElement } from '../../src/dom/HTMLButtonElement';

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
