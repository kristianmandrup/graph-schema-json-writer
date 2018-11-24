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

  describe.only("writeClass with extendsClass", () => {
    const written = classType.writeClass("Person", personMap, {
      extendsClass: "BaseEntity"
    });
    console.log(written);

    test("extends BaseEntity", () => {
      expect(written).toMatch(/Person extends BaseEntity/);
    });
  });

  describe("addImplements", () => {
    const header = classType.addImplements("class Person", ["IEntity"]);

    test("implements IEntity", () => {
      expect(header).toMatch(/Person implements IEntity/);
    });
  });
});

describe.skip("writeClass", () => {
  const written = writeClass("Person", personMap);

  test("written", () => {
    expect(written).toBeDefined();
  });
});
