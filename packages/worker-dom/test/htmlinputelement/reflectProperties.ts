import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLInputElement } from '../../worker-thread/dom/HTMLInputElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLInputElement(NodeType.ELEMENT_NODE, 'input', null),
  };
});

testReflectedProperties([
  { formAction: [''] },
  { formEncType: [''] },
  { formMethod: [''] },
  { formTarget: [''] },
  { name: [''] },
  { type: ['text'] },
  { disabled: [false] },
  { autofocus: [false] },
  { required: [false] },
  { defaultChecked: [false, 'checked'] },
  { alt: [''] },
  { height: [0] },
  { src: [''] },
  { width: [0] },
  { accept: [''] },
  { autocomplete: [''] },
  { maxLength: [0] },
  { size: [0] },
  { pattern: [''] },
  { placeholder: [''] },
  { readOnly: [false] },
  { min: [''] },
  { max: [''] },
  { defaultValue: ['', 'value'] },
  { dirName: [''] },
  { multiple: [false] },
  { step: [''] },
  { autocapitalize: [''] },
]);
