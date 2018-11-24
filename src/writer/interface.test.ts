import { Interface, writeInterface } from "./interface";

const map = {
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
};

describe("Interface", () => {
  const input = new Interface();

  describe("write", () => {
    const written = input.write(map);

    test("written", () => {
      expect(written).toBeDefined();
    });
  });
});

describe("writeInterface", () => {
  const written = writeInterface("IPerson", map);

  test("written", () => {
    expect(written).toBeDefined();
  });
});
