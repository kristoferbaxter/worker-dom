import { Node } from './Node';
import { Element } from './Element';
import { Text } from './Text';
import { Event } from './Event';

type window = Object | undefined;

if (typeof (window as window) !== 'undefined') {
  (window as window).dom = { Node, Element, Text, Event };
}

export { Node, Element, Text, Event };
