import { expect } from "chai";

import { isAbstractDataAttributeDescription } from "./AbstractDataAttribute";
import { DAType } from "./DAType";
import { isProtNsDescription } from "./ProtNs.js";

const scl = new DOMParser().parseFromString(
  `<SCL xmlns="http://www.iec.ch/61850/2003/SCL" >
    <DataTypeTemplates>      
        <DAType id="someEqual" desc="someDesc">     
          <BDA name="mag" desc="someEqual" bType="Struct" sAddr="someSAddr" type="AnalogueValue"/>
          <BDA name="stVal" desc="someEnumBDA" bType="Enum" sAddr="someSAddr" type="someEnumType"/>
          <ProtNs type="8-MMS">IEC 61850-8-1:2007</ProtNs>
        </DAType>
        <DAType id="someOtherEqual" desc="someDesc">     
          <BDA name="mag" desc="someEqual" bType="Struct" sAddr="someSAddr" type="AnalogueValue"/>
          <BDA name="stVal" desc="someEnumBDA" bType="Enum" sAddr="someSAddr" type="someEnumType"/>
          <ProtNs>IEC 61850-8-1:2007</ProtNs>
        </DAType>
        <DAType id="AnalogueValue" iedType="someIedType">
            <BDA desc="someDiff1" name="f" bType="FLOAT32" valKind="RO" valImport="true">
                <Val sGroup="1">45.00</Val>
                <Val sGroup="2">65.00</Val>
            </BDA>
        </DAType>
        <EnumType id="someEnumType" desc="someDesc">     
          <EnumVal ord="-1" desc="someDesc">SomeContent</EnumVal>
          <EnumVal ord="13">SomeOtherContent</EnumVal>
          <EnumVal ord="-23"></EnumVal>
        </EnumType>
    </DataTypeTemplates>
    </SCL>`,
  "application/xml"
);

const baseDAType = scl.querySelector("#someEqual")!;
const equalDAType = scl.querySelector("#someOtherEqual")!;
const diffDAType1 = scl.querySelector("#AnalogueValue")!;

describe("Description for SCL schema element DAType", () => {
  it("returns property iedType with existing iedType attribute", () => {
    expect(DAType(diffDAType1)).to.haveOwnProperty("iedType", "someIedType");
    expect(DAType(baseDAType)).to.not.haveOwnProperty("iedType");
  });

  it("returns property bdas recording BDA child elements", () =>
    expect(DAType(baseDAType).bdas["mag"]).to.satisfies(
      isAbstractDataAttributeDescription
    ));

  it("returns property protns collecting ProtNs child elements", () => {
    expect(Array.isArray(DAType(baseDAType).protns)).to.be.true;
    expect(DAType(baseDAType).protns[0]).to.satisfies(isProtNsDescription);
  });

  it("returns same description with semantically equal DAType's", () =>
    expect(JSON.stringify(DAType(baseDAType))).to.equal(
      JSON.stringify(DAType(equalDAType))
    ));

  it("returns different description with unequal DAType elements", () =>
    expect(JSON.stringify(DAType(baseDAType))).to.not.equal(
      JSON.stringify(DAType(diffDAType1))
    ));
});
