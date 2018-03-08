import { Node, NodeType } from './Node';
import { DOMTokenList } from './DOMTokenList';

interface Attribute {
  [index: string]: string;
}

const elementPredicate = (node: Node) => node.nodeType === NodeType.ELEMENT_NODE;

export class Element extends Node {
  public attributes: Attribute[] = [];
  public classList: DOMTokenList = new DOMTokenList(this, 'className', null);
  // Unimplemented
  // Element.querySelector – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
  // Element.querySelectorAll – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   * @returns string representation of the Element's class.
   */
  get className(): string {
    return this.classList.value;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   * @param value new string representaiton of the Element's class.
   */
  set className(value: string) {
    this.classList.value = value;
  }

  /**
   * Getter returning children of an Element that are Elements themselves.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
   * @returns Element objects that are children of this ParentNode, omitting all of its non-element nodes.
   */
  get children(): Element[] {
    return this.childNodes.filter(elementPredicate) as Element[];
  }

  /**
   * Getter returning the number of child elements of a Element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/childElementCount
   * @returns number of child elements of the given Element.
   */
  get childElementCount(): number {
    return this.children.length;
  }

  /**
   * Getter returning the first Element in Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild
   * @return first childNode that is also an element.
   */
  get firstElementChild(): Element | null {
    return (this.childNodes.find(elementPredicate) as Element) || null;
  }

  /**
   * Getter returning the last Element in Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/lastElementChild
   * @return first childNode that is also an element.
   */
  get lastElementChild(): Element | null {
    const children = this.children;
    return children[children.length - 1] || null;
  }
}
