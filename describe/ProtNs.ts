export function isProtNsDescription(
  type: ProtNsDescription
): type is ProtNsDescription {
  return (
    (type as ProtNsDescription).type !== undefined &&
    (type as ProtNsDescription).val !== undefined
  );
}

export type ProtNsDescription = {
  /** Type of namespace defaulting to "8-MMS" */
  type: string;
  /** ProtNs textContent defaulting to "" */
  val: string;
};

export function describeProtNs(element: Element): ProtNsDescription {
  const protNsDesc: ProtNsDescription = {
    type: "8-MMS",
    val: element.textContent || "",
  };

  if (element.getAttribute("type"))
    protNsDesc.type = element.getAttribute("type")!;

  return protNsDesc;
}
