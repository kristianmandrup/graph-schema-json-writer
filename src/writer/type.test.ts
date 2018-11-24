import { Type, writeType } from "./type";

const map = {
  Person: {
    fields: {
      name: {
        type: "String",
        directives: {},
        isNullable: false,
        isList: false
      },
      age: {
        type: "Int",
        directives: {
          range: {
            min: 0,
            max: 130
          }
        },
        isNullable: false,
        isList: false
      },
      gender: {
        type: "Gender",
        directives: {},
        isNullable: false,
        isList: false
      }
    },
    directives: {
      Entity: {}
    },
    type: "Type",
    implements: []
  }
};

describe("Type", () => {
  const type = new Type();

  describe("write", () => {
    const written = type.write(map);

    test("written", () => {
      expect(written).toMatch(/name: String\!/);
      expect(written).toMatch(/@range\(min: 0, max: 130\)/);
      expect(written).toMatch(/age: Int\! @range\(min: 0, max: 130\)/);
      expect(written).toMatch(/age: Int/);
      expect(written).toMatch(/gender: Gender/);
    });
  });

  describe("writeType", () => {
    const written = type.writeType("Person", map.Person);
    // console.log("writeType", written);

    test("written", () => {
      expect(written).toMatch(/name: String\!/);
      expect(written).toMatch(/@range\(min: 0, max: 130\)/);
      expect(written).toMatch(/age: Int\! @range\(min: 0, max: 130\)/);
      expect(written).toMatch(/age: Int\!/);
      expect(written).toMatch(/gender: Gender/);
    });
  });

  describe("writeFields", () => {
    const written = type.writeFields(map.Person.fields);

    test("written", () => {
      expect(written).toMatch(/name: String\!/);
      expect(written).toMatch(/age: Int/);
      expect(written).toMatch(/gender: Gender/);
    });
  });

  describe("writeField", () => {
    const written = type.writeField("name", map.Person.fields.name);

    test("written", () => {
      expect(written).toMatch(/name: String\!/);
    });
  });
});
