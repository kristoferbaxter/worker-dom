import test from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLImageElement } from '../../worker-thread/dom/HTMLImageElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLImageElement(NodeType.ELEMENT_NODE, 'img', null),
  };
});

testReflectedProperties([
  { alt: [''] },
  { crossOrigin: [''] },
  { height: [0] },
  { isMap: [false] },
  { referrerPolicy: [''] },
  { src: [''] },
  { sizes: [''] },
  { srcset: [''] },
  { useMap: [''] },
  { width: [0] },
]);
