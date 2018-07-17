import test from 'ava';
import { testReflectedProperties } from '../common/reflectProperties';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLAnchorElement(NodeType.ELEMENT_NODE, 'a', null),
  };
});

testReflectedProperties([{ href: [''] }, { hreflang: [''] }, { media: [''] }, { target: [''] }, { type: [''] }]);
