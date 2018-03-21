import { Node } from './Node';
import { Element } from './Element';
import { Text } from './Text';
import { Event } from './Event';

// interface window extends Window {
//   dom: {
//     Node: typeof Node,
//     Element: typeof Element,
//     Text: typeof Text,
//     Event: typeof Event,
//   }
// }

// if (typeof window !== 'undefined') {
//   (window as window).dom = { Node, Element, Text, Event };
// }

export { Node, Element, Text, Event };
