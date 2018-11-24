import { Type, writeType } from "./type";

const map = {
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
};

describe("Type", () => {
  const type = new Type();

  describe("write", () => {
    const written = type.write(map);

    test("written", () => {
      expect(written).toBeDefined();
    });
  });
});

describe("writeType", () => {
  const written = writeType("Person", map);

  test("written", () => {
    expect(written).toBeDefined();
  });
});
