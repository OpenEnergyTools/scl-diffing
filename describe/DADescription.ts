import {
  AbstractDataAttributeDescription,
  describeAbstractDataAttribute,
} from "./AbstractDataAttribute.js";
import { ProtNsDescription, describeProtNs } from "./ProtNs.js";

type FCs = "ST" | "MX" | "CO" | "SP" | "SG" | "SE" | "SV" | "CF" | "DC" | "EX";
const fCs = ["ST", "MX", "CO", "SP", "SG", "SE", "SV", "CF", "DC", "EX"];

export interface DADescription extends AbstractDataAttributeDescription {
  /** Optional attribute dchg defaults to false */
  dchg: boolean;
  /** Optional attribute qchg defaults to false */
  qchg: boolean;
  /** Optional attribute dupd defaults to false */
  dupd: boolean;
  /** required attribute fc */
  fc: FCs;
  /** Direct child element ProtNS */
  protns: ProtNsDescription[];
}

export function describeDA(element: Element): DADescription {
  const daDescription: DADescription = {
    ...describeAbstractDataAttribute(element),
    dchg: false,
    qchg: false,
    dupd: false,
    fc: "ST",
    protns: [],
  };

  const [dchg, qchg, dupd, fc] = ["dchg", "qchg", "dupd", "fc"].map((attr) =>
    element.getAttribute(attr)
  );

  if (dchg && dchg === "true") daDescription.dchg = true;
  if (qchg && qchg === "true") daDescription.qchg = true;
  if (dupd && dupd === "true") daDescription.dupd = true;

  if (fc && fCs.includes(fc)) daDescription.fc = fc as FCs;

  Array.from(element.children)
    .filter((child) => child.tagName === "ProtNs")
    .forEach((protNs) => {
      if (protNs.tagName === "ProtNs")
        daDescription.protns.push(describeProtNs(protNs));
    });

  return daDescription;
}
