import { Private, PrivateDescription } from "./describe/Private.js";
import { Text, TextDescription } from "./describe/Text.js";
import { EnumType, EnumTypeDescription } from "./describe/EnumType.js";
import { DAType, DATypeDescription } from "./describe/DAType.js";

export type Description =
  | PrivateDescription
  | TextDescription
  | EnumTypeDescription
  | DATypeDescription;

const sclElementDescriptors: Partial<
  Record<string, (element: Element) => Description>
> = {
  Private,
  Text,
  EnumType,
  DAType,
};

export function describe(element: Element): Description | undefined {
  return sclElementDescriptors[element.tagName]?.(element);
}
