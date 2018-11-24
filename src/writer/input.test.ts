import { Input, writeInput } from "./input";

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
  type: "Input",
  implements: []
};

describe("Input", () => {
  const input = new Input();

  describe("write", () => {
    const written = input.write(map);

    test("written", () => {
      expect(written).toBeDefined();
    });
  });
});

describe("writeInput", () => {
  const written = writeInput("Person", map);

  test("written", () => {
    expect(written).toBeDefined();
  });
});
