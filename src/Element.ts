import { Node, NodeType } from './Node';
import { DOMTokenList } from './DOMTokenList';

interface Attributes {
  [index: string]: string;
}

const elementPredicate = (node: Node): boolean => node.nodeType === NodeType.ELEMENT_NODE;

export class Element extends Node {
  public attributes: Attributes = {};
  public classList: DOMTokenList = new DOMTokenList(this, 'className', null);
  // No implementation necessary
  // Element.id

  // Unimplemented
  // Element.clientHeight – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
  // Element.clientLeft – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientLeft
  // Element.clientTop – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientTop
  // Element.clientWidth – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
  // Element.querySelector – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
  // Element.querySelectorAll – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   * @return string representation of the Element's class.
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
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML
   * @return string representation of serialized HTML describing the Element and its descendants.
   */
  get outerHTML(): string {
    const attributeToString = (key: string, value: string): string => `${key}='${value}'`;
    const attributesToString = Object.keys(this.attributes)
      .map(key => attributeToString(key, this.attributes[key]))
      .join(' ');
    const tagOpening = [this.nodeName, attributeToString('class', this.className), attributesToString].join(' ').trim();

    return `<${tagOpening}>${this.innerHTML}</${this.nodeName}>`;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
   * @return string representation of serialized HTML describing the Element's descendants.
   */
  get innerHTML(): string {
    const children = this.children;

    if (children.length) {
      return children.map(child => child.outerHTML).join('');
    }
    return '';
  }

  /**
   * Getter returning children of an Element that are Elements themselves.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
   * @return Element objects that are children of this ParentNode, omitting all of its non-element nodes.
   */
  get children(): Element[] {
    return this.childNodes.filter(elementPredicate) as Element[];
  }

  /**
   * Getter returning the number of child elements of a Element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/childElementCount
   * @return number of child elements of the given Element.
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
