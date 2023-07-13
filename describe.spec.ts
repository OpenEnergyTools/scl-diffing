import { expect } from "chai";

import { describe as describeSclElement } from "./describe.js";

const testScl = new DOMParser().parseFromString(
  `<SCL
      xmlns="http://www.iec.ch/61850/2003/SCL"
      xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates"
      xmlns:ens="http://somevalidURI"
    >
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
      <EnumType id="someID">
        <Private type="someType" desc="someDesc" sxy:x="10" ens:some="someOtherNameSpace">
          <![CDATA[some comment]]>
          <IED name="somePrivateIED"/>
        </Private>
        <Text>Some detailed description</Text>
        <ens:SomeNonSCLElement />
        <EnumVal ord="1">A</EnumVal>
      </EnumType>
      <EnumType id="someDiffID" >
        <Private type="someType" desc="someDesc" ens:some="someOtherNameSpace" sxy:x="10" >
          <![CDATA[some comment]]>
          <IED name="somePrivateIED"/>
        </Private>
        <Text>Some detailed description</Text>
        <ens:SomeNonSCLElement />
        <EnumVal ord="1"></EnumVal>
      </EnumType>
      <EnumType id="someOtherID">
        <Private type="someType" desc="someDesc" sxy:x="10" ens:some="someOtherNameSpace">
          <![CDATA[some comment]]>
          <IED name="somePrivateIED"/>
        </Private>
        <Text>Some detailed description</Text>
        <ens:SomeNonSCLElement />
        <EnumVal ord="1">A</EnumVal>
      </EnumType>
      </DataTypeTemplates>
    </SCL>`,
  "application/xml"
);

const sclElement = testScl.querySelector("SCL")!;
const omeNonSCLElement = testScl.querySelector("SomeNonSCLElement")!;

const baseEnumType = testScl.querySelector("#someID")!;
const diffEnumType = testScl.querySelector("#someDiffID")!;
const equalEnumType = testScl.querySelector("#someOtherID")!;

const baseDAType = testScl.querySelector("#someEqual")!;
const equalDAType = testScl.querySelector("#someOtherEqual")!;
const diffDAType1 = testScl.querySelector("#AnalogueValue")!;

describe("Describe SCL elements function", () => {
  it("returns undefined with missing describe function", () =>
    expect(describeSclElement(omeNonSCLElement)).to.be.undefined);

  it("returns undefined with missing describe function", () =>
    expect(describeSclElement(sclElement)).to.be.undefined);

  it("return equal description with semantically equal SCL element", () =>
    expect(JSON.stringify(describeSclElement(baseEnumType))).to.equal(
      JSON.stringify(describeSclElement(equalEnumType))
    ));

  it("return different description with semantically unequal SCL element", () =>
    expect(JSON.stringify(describeSclElement(diffEnumType))).to.not.equal(
      JSON.stringify(describeSclElement(equalEnumType))
    ));

  it("returns same description with semantically equal DAType's", () =>
    expect(JSON.stringify(describeSclElement(baseDAType))).to.equal(
      JSON.stringify(describeSclElement(equalDAType))
    ));

  it("returns different description with unequal DAType elements", () =>
    expect(JSON.stringify(describeSclElement(baseDAType))).to.not.equal(
      JSON.stringify(describeSclElement(diffDAType1))
    ));
});
