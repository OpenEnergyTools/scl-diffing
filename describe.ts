import { Private, PrivateDescription } from "./describe/Private.js";
import { Text, TextDescription } from "./describe/Text.js";
import { EnumType, EnumTypeDescription } from "./describe/EnumType.js";
import { DAType, DATypeDescription } from "./describe/DAType.js";
import { DOType, DOTypeDescription } from "./describe/DOType.js";

export type Description =
  | PrivateDescription
  | TextDescription
  | EnumTypeDescription
  | DATypeDescription
  | DOTypeDescription;

const sclElementDescriptors: Partial<
  Record<string, (element: Element) => Description>
> = {
  Private,
  Text,
  EnumType,
  DAType,
  DOType,
};

export function describe(element: Element): Description | undefined {
  return sclElementDescriptors[element.tagName]?.(element);
}
