import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLScriptElement } from '../../worker-thread/dom/HTMLScriptElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLScriptElement(NodeType.ELEMENT_NODE, 'script', null),
  };
});

testReflectedProperties([
  { type: [''] },
  { src: [''] },
  { charset: [''] },
  { async: [false] },
  { defer: [false] },
  { crossOrigin: [''] },
  { noModule: [false] },
]);
