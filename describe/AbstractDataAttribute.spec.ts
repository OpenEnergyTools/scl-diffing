import { expect } from "chai";

import { describeAbstractDataAttribute } from "./AbstractDataAttribute.js";
import { isEnumTypeDescription } from "./EnumType.js";
import { isDATypeDescription } from "./DAType.js";

const scl = new DOMParser().parseFromString(
  `<SCL xmlns="http://www.iec.ch/61850/2003/SCL" >
    <DataTypeTemplates>      
        <DAType id="someEqual" desc="someDesc">     
          <BDA name="mag" desc="someEqual" bType="Struct" sAddr="someSAddr" type="AnalogueValue"/>
          <BDA name="stVal" desc="someEnumBDA" bType="Enum" sAddr="someSAddr" type="someEnumType"/>
        </DAType>
        <DAType id="AnalogueValue">
            <BDA desc="someDiff1" name="f" bType="FLOAT32" valKind="RO" valImport="true">
                <Val>45.00</Val>
            </BDA>
        </DAType>
        <DAType id="daTypeCollection">
          <BDA name="mag" desc="someEqual" bType="Struct" sAddr="someSAddr" type="AnalogueValue"/>
          <BDA name="cVal" desc="missingBType" />
          <BDA name="hstRangeC" desc="arrayBDA" bType="FLOAT32" count="34" />
          <BDA name="hstVal" desc="refArrayBDA" bType="FLOAT32" count="hstRangeC" />
          <BDA name="hstVal" desc="invalidRefArrayBDA" bType="FLOAT32" count="invalidRef" />
          <BDA name="missingCount" bType="FLOAT32" />
          <BDA name="hstVal" desc="missingRefArrayBDA" bType="FLOAT32" count="missingCount" />
          <BDA desc="someDiff3" name="f" bType="FLOAT32" valKind="RO" valImport="true">
            <Val sGroup="1">45.00</Val>
            <Val sGroup="2">55.00</Val>
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

const orphanBDA = new DOMParser()
  .parseFromString(
    `<BDA name="hstVal" desc="refArrayBDA" bType="FLOAT32" count="hstRangeC" />`,
    "application/xml"
  )
  .querySelector("BDA")!;

const missingBType = scl.querySelector(`BDA[desc="missingBType"`)!;
const refInvalidCount = scl.querySelector(`BDA[desc="invalidRefArrayBDA"`)!;
const refMissingCount = scl.querySelector(`BDA[desc="missingRefArrayBDA"`)!;
const refValidCount = scl.querySelector(`BDA[desc="refArrayBDA"`)!;
const directCount = scl.querySelector(`BDA[desc="arrayBDA"`)!;

const baseBDA = scl.querySelector(`BDA[desc="someEqual"`)!;
const diffBDA1 = scl.querySelector(`BDA[desc="someDiff1"`)!;
const diffBDA2 = scl.querySelector(`BDA[desc="someEnumBDA"`)!;
const diffBDA3 = scl.querySelector(`BDA[desc="someDiff3"`)!;
const equalBDA = scl.querySelector(
  `DAType[id="daTypeCollection"] > BDA[desc="someEqual"`
)!;

describe("Description for SCL schema type tAbstractDataAttribute", () => {
  it("returns property sAddr with existing sAddr attribute", () => {
    expect(describeAbstractDataAttribute(baseBDA)).to.haveOwnProperty(
      "sAddr",
      "someSAddr"
    );
    expect(describeAbstractDataAttribute(diffBDA1)).to.not.haveOwnProperty(
      "sAddr"
    );
  });

  it("returns property valKind defaulted to 'Set' ", () => {
    expect(describeAbstractDataAttribute(baseBDA)).to.haveOwnProperty(
      "valKind",
      "Set"
    );
    expect(describeAbstractDataAttribute(diffBDA1)).to.haveOwnProperty(
      "valKind",
      "RO"
    );
  });

  it("returns property valImport defaulted to false", () => {
    expect(describeAbstractDataAttribute(baseBDA)).to.haveOwnProperty(
      "valImport",
      false
    );
    expect(describeAbstractDataAttribute(diffBDA1)).to.haveOwnProperty(
      "valImport",
      true
    );
  });

  it("returns property bType or 'undefined' if missing ", () => {
    expect(describeAbstractDataAttribute(diffBDA1)).to.haveOwnProperty(
      "bType",
      "FLOAT32"
    );
    expect(describeAbstractDataAttribute(missingBType)).to.haveOwnProperty(
      "bType",
      "undefined"
    );
  });

  it("returns property count directly or through reference", () => {
    expect(describeAbstractDataAttribute(directCount)).to.haveOwnProperty(
      "count",
      34
    );
    expect(describeAbstractDataAttribute(refValidCount)).to.haveOwnProperty(
      "count",
      34
    );
  });

  it("defaults property count 0 if cannot be determined", () => {
    expect(describeAbstractDataAttribute(orphanBDA)).to.haveOwnProperty(
      "count",
      0
    );

    expect(describeAbstractDataAttribute(refInvalidCount)).to.haveOwnProperty(
      "count",
      0
    );

    expect(describeAbstractDataAttribute(refMissingCount)).to.haveOwnProperty(
      "count",
      0
    );
  });

  it("returns property type when bType Enum or Struct", () => {
    expect(describeAbstractDataAttribute(diffBDA1)).to.not.haveOwnProperty(
      "type"
    );

    expect(describeAbstractDataAttribute(baseBDA).type).to.satisfies(
      isDATypeDescription
    );

    expect(describeAbstractDataAttribute(diffBDA2).type).to.satisfies(
      isEnumTypeDescription
    );
  });

  it("returns property val with existing Val children", () => {
    expect(describeAbstractDataAttribute(diffBDA1).val.length).to.equal(1);
    expect(describeAbstractDataAttribute(diffBDA3).val.length).to.equal(2);
    expect(describeAbstractDataAttribute(diffBDA3).val[1].sGroup).to.equal(2);
    expect(describeAbstractDataAttribute(diffBDA3).val[1].val).to.equal(
      "55.00"
    );
  });

  it("returns same description with semantically equal BDA's", () =>
    expect(JSON.stringify(describeAbstractDataAttribute(baseBDA))).to.equal(
      JSON.stringify(describeAbstractDataAttribute(equalBDA))
    ));

  it("returns different description with unequal BDA elements", () =>
    expect(JSON.stringify(describeAbstractDataAttribute(baseBDA))).to.not.equal(
      JSON.stringify(describeAbstractDataAttribute(diffBDA2))
    ));
});
