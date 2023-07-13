import { DOType, DOTypeDescription } from "./DOType.js";
import { NamingDescription, describeNaming } from "./Naming.js";

export interface SDODescription extends NamingDescription {
  /** Type attribute referencing a DOType */
  type: DOTypeDescription | "invalidReference";
}

export function describeSDO(element: Element): SDODescription {
  const sdoDescription: SDODescription = {
    ...describeNaming(element),
    type: "invalidReference",
  };

  const referencedType = Array.from(
    element.closest("DataTypeTemplates")?.children ?? []
  ).find(
    (sibling) => sibling.getAttribute("id") === element.getAttribute("type")
  )!;
  if (referencedType && referencedType.tagName === "DOType")
    sdoDescription.type = DOType(element);

  return sdoDescription;
}
