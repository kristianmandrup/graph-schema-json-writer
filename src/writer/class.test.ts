import { ClassType, writeClass } from "./class";

const personMap = {
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
  type: "Object",
  implements: [],
  extends: "BaseEntity"
};

describe.only("ClassType", () => {
  const classType = new ClassType();

  describe("write", () => {
    const written = classType.write({ Person: personMap });
    console.log(written);

    test("written", () => {
      expect(written).toBeDefined();
    });
  });

  describe.only("writeClass", () => {
    const written = classType.writeClass("Person", personMap);
    console.log(written);

    test("written", () => {
      expect(written).toBeDefined();
    });
  });
});

describe.skip("writeClass", () => {
  const written = writeClass("Person", personMap);

  test("written", () => {
    expect(written).toBeDefined();
  });
});
