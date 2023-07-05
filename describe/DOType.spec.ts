import { expect } from "chai";

import { DOType } from "./DOType.js";
import { describeSDO } from "./SDODescription.js";

const scl = new DOMParser().parseFromString(
  `<SCL xmlns="http://www.iec.ch/61850/2003/SCL" >
    <DataTypeTemplates>      
        <DOType id="someBase" desc="someDesc" cdc="MX">     
          <SDO name="phsA" type="CMVType" desc="someDesc"/>
          <SDO name="phsB" type="CMVType" desc="someDesc"/>
          <SDO name="phsC" type="CMVOtherType" desc="someDiff"/>
          <DA name="stVal" bType="BOOLEAN" fc="ST" />
          <DA name="q" bType="Quality" fc="ST" />
        </DOType>
        <DOType id="someEqual" desc="someDesc" cdc="MX">     
          <SDO name="phsB" type="CMVType" desc="someDesc"/>
          <SDO name="phsA" type="CMVType" desc="someDesc"/>
          <SDO name="phsC" type="CMVOtherType" desc="someDiff"/>
          <DA name="q" bType="Quality" fc="ST" />
          <DA name="stVal" bType="BOOLEAN" fc="ST" />
        </DOType>
        <DOType cdc="CMV" id="CMVType" iedType="someIedType">
            <DA name="stVal" bType="FLOAT32" fc="MV" />
        </DOType>
        <DOType cdc="CMV" id="CMVOtherType">
            <DA name="q" bType="Quality" fc="MV" />
        </DOType>
    </DataTypeTemplates>
    </SCL>`,
  "application/xml"
);

const baseDOType = scl.querySelector(`#someBase`)!;
const equalDOType = scl.querySelector(`#someEqual`)!;
const diffDOType = scl.querySelector(`#CMVType`)!;

describe("Description for SCL schema type DOTypeDescription", () => {
  it("returns property cdc", () =>
    expect(DOType(baseDOType).cdc).to.equal("MX"));

  it("returns property iedType", () => {
    expect(DOType(diffDOType).iedType).to.equal("someIedType");
    expect(DOType(baseDOType).iedType).to.be.undefined;
  });

  it("returns same description with semantically equal DOType's", () => {
    expect(JSON.stringify(DOType(baseDOType))).to.equal(
      JSON.stringify(DOType(equalDOType))
    );
  });

  it("returns different description with unequal DOType elements", () =>
    expect(JSON.stringify(describeSDO(baseDOType))).to.not.equal(
      JSON.stringify(describeSDO(diffDOType))
    ));
});
