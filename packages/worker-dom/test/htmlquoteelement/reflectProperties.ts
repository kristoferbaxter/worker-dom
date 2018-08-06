import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLQuoteElement } from '../../worker-thread/dom/HTMLQuoteElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLQuoteElement(NodeType.ELEMENT_NODE, 'blockquote', null),
  };
});

testReflectedProperties([{ cite: [''] }]);
