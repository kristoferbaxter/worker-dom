import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLFormElement } from '../../worker-thread/dom/HTMLFormElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLFormElement(NodeType.ELEMENT_NODE, 'form', null),
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