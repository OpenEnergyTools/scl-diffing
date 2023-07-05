import { expect } from "chai";

import { describeDA } from "./DADescription.js";
import { isEnumTypeDescription } from "./EnumType.js";
import { isDATypeDescription } from "./DAType.js";

const scl = new DOMParser().parseFromString(
  `<SCL xmlns="http://www.iec.ch/61850/2003/SCL" >
    <DataTypeTemplates>      
        <DOType id="someEqual" desc="someDesc" cdc="MX">     
          <DA name="mag" dchg="true" qchg="true" dupd="true" fc="CF" desc="someEqual" bType="Struct" sAddr="someSAddr" type="AnalogueValue"/>
          <DA name="stVal" desc="someEnumDA" bType="Enum" sAddr="someSAddr" type="someEnumType"/>
          <DA name="q" desc="someDiff1" bType="Quality" fc="DC" />
        </DOType>
        <DOType id="someDiff" desc="someDesc" cdc="MX">     
          <DA name="mag" dchg="true" qchg="true" dupd="true" fc="CF" desc="someEqual" bType="Struct" sAddr="someSAddr" type="AnalogueValue"/>
          <DA name="stVal" desc="someEnumDA" bType="Enum" sAddr="someSAddr" type="someEnumType">
            <ProtNs type="8-MMS">IEC61850-7-4:2007</ProtNs>
            <ProtNs type="8-MMS">IEC61850-7-3:2007</ProtNs>
          </DA>
        </DOType>
        <DAType id="AnalogueValue" >
            <BDA name="mag" bType="FLOAT32" />
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

const baseDA = scl.querySelector(`DA[desc="someEqual"`)!;
const diffDA1 = scl.querySelector(`DA[desc="someEnumDA"`)!;
const diffDA2 = scl.querySelector(`DA[desc="someDiff1"`)!;
const diffDA4 = scl.querySelector(
  `DOType[id="someDiff"] > DA[desc="someEnumDA"]`
)!;
const equalDA = scl.querySelector(
  `DOType[id="someDiff"] > DA[desc="someEqual"]`
)!;

describe("Description for SCL schema type DADescription", () => {
  it("returns property dchg defaulting to false", () => {
    expect(describeDA(baseDA)).to.haveOwnProperty("dchg", true);
    expect(describeDA(diffDA1)).to.haveOwnProperty("dchg", false);
  });

  it("returns property qchg defaulted to false ", () => {
    expect(describeDA(baseDA)).to.haveOwnProperty("qchg", true);
    expect(describeDA(diffDA1)).to.haveOwnProperty("qchg", false);
  });

  it("returns property dupd defaulted to false", () => {
    expect(describeDA(baseDA)).to.haveOwnProperty("dupd", true);
    expect(describeDA(diffDA1)).to.haveOwnProperty("dupd", false);
  });

  it("returns property type when bType is Enum or Struct", () => {
    expect(describeDA(diffDA2)).to.not.haveOwnProperty("type");
    expect(describeDA(baseDA).type).to.satisfies(isDATypeDescription);
    expect(describeDA(diffDA1).type).to.satisfies(isEnumTypeDescription);
  });

  it("returns property protns with existing ProtNs children", () => {
    expect(describeDA(diffDA1).protns.length).to.equal(0);
    expect(describeDA(diffDA4).protns.length).to.equal(2);
    expect(describeDA(diffDA4).protns[1].val).to.equal("IEC61850-7-3:2007");
  });

  it("returns same description with semantically equal BDA's", () =>
    expect(JSON.stringify(describeDA(baseDA))).to.equal(
      JSON.stringify(describeDA(equalDA))
    ));

  it("returns different description with unequal BDA elements", () =>
    expect(JSON.stringify(describeDA(baseDA))).to.not.equal(
      JSON.stringify(describeDA(diffDA4))
    ));
});
