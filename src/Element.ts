import { Node, NodeType } from './Node';

export class Element extends Node {
  /**
   * Getter returning children of an Element that are Elements themselves.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
   * @returns Element objects that are children of this ParentNode, omitting all of its non-element nodes.
   */
  get children(): Element[] {
    return this.childNodes.filter(node => node.nodeType === NodeType.ELEMENT_NODE) as Element[];
  }

  /**
   * Getter returning the number of child elements of a Element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/childElementCount
   * @returns number of child elements of the given Element.
   */
  get childElementCount(): number {
    return this.children.length;
  }
}
