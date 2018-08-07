import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLQuoteElement } from '../../src/dom/HTMLQuoteElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLQuoteElement(NodeType.ELEMENT_NODE, 'blockquote', null),
  };
});

testReflectedProperties([{ cite: [''] }]);
