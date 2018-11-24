import { Interface, writeInterface } from "./interface";

const map = {
  IPerson: {
    fields: {
      name: {
        type: "String",
        isNullable: false,
        isList: false
      },
      age: {
        type: "Int",
        isNullable: false,
        isList: false
      },
      gender: {
        type: "Gender",
        isNullable: false,
        isList: false
      }
    },
    type: "Interface"
  }
};

describe("Interface", () => {
  const interf = new Interface();

  describe("write", () => {
    const written = interf.write(map);
    // console.log("interfaces", written);

    test("written", () => {
      expect(written).toMatch(/interface IPerson {/);
      expect(written).toMatch(/name: String\!/);
      expect(written).toMatch(/age: Int\!/);
      expect(written).toMatch(/gender: Gender\!/);
    });
  });

  describe.only("writeInterface", () => {
    const written = interf.writeInterface("IPerson", map.IPerson);
    // console.log("interface", written);

    test("written", () => {
      expect(written).toMatch(/interface IPerson {/);
      expect(written).toMatch(/name: String\!/);
      expect(written).toMatch(/age: Int\!/);
      expect(written).toMatch(/gender: Gender\!/);
    });
  });
});
