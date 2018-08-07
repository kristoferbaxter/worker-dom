import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLLinkElement } from '../../src/dom/HTMLLinkElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLLinkElement(NodeType.ELEMENT_NODE, 'link', null),
  };
});

testReflectedProperties([
  { as: [''] },
  { crossOrigin: [''] },
  { disabled: [false] },
  { href: [''] },
  { hreflang: [''] },
  { media: [''] },
  { referrerPolicy: [''] },
  { sizes: [''] },
  { type: [''] },
]);
