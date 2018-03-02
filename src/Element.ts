import { Node, NodeType } from "./Node";

export class Element extends Node {
  /**
   * Element.children() is supposed to be supplied by a ParentNode mixin.
   * Intentionally implemewnted only on Element and extensions of it here.
   *
   * Returns a live HTMLCollection containing all of the Element objects
   * that are children of this ParentNode, omitting all of its non-element nodes.
   */
  get children(): Element[] {
    return this.childNodes.filter(node => node.nodeType === NodeType.ELEMENT_NODE) as Element[];
  }
}
