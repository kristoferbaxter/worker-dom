import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLEmbedElement } from '../../worker-thread/dom/HTMLEmbedElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLEmbedElement(NodeType.ELEMENT_NODE, 'embed', null),
  };
});

testReflectedProperties([{ height: [''] }, { src: [''] }, { type: [''] }, { width: [''] }]);
