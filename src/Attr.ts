import { keyValueString } from './utils';

export type NamespaceURI = string | null;
export interface Attr {
  namespaceURI: NamespaceURI;
  name: string;
  value: string;
}

export const toString = (attributes: Attr[]): string => attributes.map(({ name, value }) => keyValueString(name, value)).join(' ');
export const matchPredicate = (namespaceURI: NamespaceURI, name: string): ((attr: Attr) => boolean) => attr => attr.namespaceURI === namespaceURI && attr.name === name;
