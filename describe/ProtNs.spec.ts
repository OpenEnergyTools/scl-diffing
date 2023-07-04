import { expect } from "chai";
import { describeProtNs } from "./ProtNs";

const scl = new DOMParser().parseFromString(
  `<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
    <DataTypeTemplates>
        <DAType id="someDAType">
            <ProtNs>IEC 61850-8-1:2003</ProtNs>
        </DAType>
        <DAType id="someDifferentDAType1">
            <ProtNs>IEC 61850-8-1:2007</ProtNs>
        </DAType>
        <DAType id="someDifferentDAType2">
            <ProtNs></ProtNs>
        </DAType>
        <DAType id="someOtherDAType">
            <ProtNs type="8-MMS">IEC 61850-8-1:2003</ProtNs>
        </DAType>
    </DataTypeTemplates>
  </SCL>`,
  "application/xml"
);

const baseProtNs = scl.querySelector('DAType[id="someDAType"] > ProtNs')!;
const diffProtNs1 = scl.querySelector(
  'DAType[id="someDifferentDAType1"] > ProtNs'
)!;
const diffProtNs2 = scl.querySelector(
  'DAType[id="someDifferentDAType2"] > ProtNs'
)!;
const equalProtNs = scl.querySelector('DAType[id="someOtherDAType"] > ProtNs')!;

describe("Describes the SCL element Val", () => {
  it("returns type property defaulting to 8-MMS ", () => {
    expect(describeProtNs(baseProtNs)).to.haveOwnProperty("type", "8-MMS");
    expect(describeProtNs(equalProtNs)).to.haveOwnProperty("type", "8-MMS");
  });

  it("returns equal description with semantically equal ProNs element", () =>
    expect(JSON.stringify(describeProtNs(baseProtNs))).to.equal(
      JSON.stringify(describeProtNs(equalProtNs))
    ));

  it("returns different description with semantically different ProtNs element", () => {
    expect(JSON.stringify(describeProtNs(baseProtNs))).to.not.equal(
      JSON.stringify(describeProtNs(diffProtNs1))
    );
    expect(JSON.stringify(describeProtNs(baseProtNs))).to.not.equal(
      JSON.stringify(describeProtNs(diffProtNs2))
    );
  });
});
