import test from 'ava';
import { testReflectedProperties, testReflectedProperty } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLFormElement } from '../../worker-thread/dom/HTMLFormElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLFormElement(NodeType.ELEMENT_NODE, 'fieldset', null),
  };
});

testReflectedProperties([
  { name: [''] },
  { method: ['get'] },
  { target: [''] },
  { action: [''] },
  { enctype: ['application/x-www-form-urlencoded'] },
  { acceptCharset: ['', 'accept-charset'] },
  { autocapitalize: ['sentences'] },
  { autocomplete: ['on'] },
]);
