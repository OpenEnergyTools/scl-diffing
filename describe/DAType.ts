import {
  AbstractDataAttributeDescription,
  describeAbstractDataAttribute,
} from "./AbstractDataAttribute.js";
import { NamingDescription, describeNaming } from "./Naming.js";
import { ProtNsDescription, describeProtNs } from "./ProtNs.js";

export function isDATypeDescription(
  type: DATypeDescription
): type is DATypeDescription {
  return (
    (type as DATypeDescription).bdas !== undefined &&
    (type as DATypeDescription).protns !== undefined
  );
}

export interface DATypeDescription extends NamingDescription {
  /** Optional DAType iedType attribute */
  iedType?: string;
  /** `BDA` elements with existing attribute */
  bdas: Record<string, AbstractDataAttributeDescription>;
  protns: ProtNsDescription[];
}

export function DAType(element: Element): DATypeDescription {
  const daTypeDesc: DATypeDescription = {
    ...describeNaming(element),
    bdas: {},
    protns: [],
  };

  if (element.getAttribute("iedType"))
    daTypeDesc.iedType = element.getAttribute("iedType")!;

  Array.from(element.children)
    .filter((child) => child.tagName === "BDA" || child.tagName === "ProtNs")
    .forEach((bdaOrProtNs) => {
      if (
        bdaOrProtNs.tagName === "BDA" &&
        bdaOrProtNs.getAttribute("name") &&
        bdaOrProtNs.getAttribute("bType")
      )
        daTypeDesc["bdas"][bdaOrProtNs.getAttribute("name")!] =
          describeAbstractDataAttribute(bdaOrProtNs);
      if (bdaOrProtNs.tagName === "ProtNs")
        daTypeDesc.protns.push(describeProtNs(bdaOrProtNs));
    });

  return daTypeDesc;
}
