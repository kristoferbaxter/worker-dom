import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLEmbedElement } from '../../src/dom/HTMLEmbedElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLEmbedElement(NodeType.ELEMENT_NODE, 'embed', null),
  };
});

testReflectedProperties([{ height: [''] }, { src: [''] }, { type: [''] }, { width: [''] }]);
