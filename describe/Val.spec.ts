import { expect } from "chai";
import { describeVal } from "./Val.js";

const scl = new DOMParser().parseFromString(
  `<SCL
        xmlns="http://www.iec.ch/61850/2003/SCL"
        xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates"
        xmlns:ens="http://somevalidURI"
      >
        <DataTypeTemplates>
            <DAType id="someDAType">
                <BDA name="someBDA">
                    <Val sGroup="1">someVal</Val>
                    <Val sGroup="2">someOtherVal</Val>
                </BDA>
                <BDA name="someOtherBDA">
                    <Val></Val>
                </BDA>
                <BDA name="withInvalidsGroup">
                    <Val sGroup="someInvalidsGroup">someVal</Val>
                </BDA>
            </DAType>
            <DAType id="someOtherDAType">
                <BDA name="someBDA">
                    <Val sGroup="1">someVal</Val>
                    <Val sGroup="2">someOtherVal</Val>
                </BDA>
                <BDA name="someOtherBDA">
                    <Val></Val>
                </BDA>
            </DAType>
        </DataTypeTemplates>
      </SCL>`,
  "application/xml"
);

const base1 = scl.querySelector(
  'DAType[id="someDAType"] > BDA[name="someBDA"] > Val'
)!;
const base2 = scl.querySelector(
  'DAType[id="someDAType"] > BDA[name="someOtherBDA"] > Val'
)!;
const equal1 = scl.querySelector(
  'DAType[id="someOtherDAType"] > BDA[name="someBDA"] > Val'
)!;
const equal2 = scl.querySelector(
  'DAType[id="someOtherDAType"] > BDA[name="someOtherBDA"] > Val'
)!;

const invalidsGroup = scl.querySelector('Val[sGroup="someInvalidsGroup"]')!;

describe("Describes the SCL element Val", () => {
  it("returns equal description with semantically equal Val element", () => {
    expect(JSON.stringify(describeVal(base1))).to.equal(
      JSON.stringify(describeVal(equal1))
    );
    expect(JSON.stringify(describeVal(base2))).to.equal(
      JSON.stringify(describeVal(equal2))
    );
  });

  it("returns different description with semantically different Val element", () => {
    expect(JSON.stringify(describeVal(base1))).to.not.equal(
      JSON.stringify(describeVal(equal2))
    );
    expect(JSON.stringify(describeVal(base2))).to.not.equal(
      JSON.stringify(describeVal(equal1))
    );
  });

  it("ignores schema invalid sGroup definition", () =>
    expect(describeVal(invalidsGroup)).to.not.haveOwnProperty("sGroup"));
});
