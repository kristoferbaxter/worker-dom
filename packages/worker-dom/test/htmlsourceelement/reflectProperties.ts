import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../src/dom/Node';
import { HTMLSourceElement } from '../../src/dom/HTMLSourceElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLSourceElement(NodeType.ELEMENT_NODE, 'source', null),
  };
});

testReflectedProperties([{ media: [''] }, { sizes: [''] }, { src: [''] }, { srcset: [''] }, { type: [''] }]);
