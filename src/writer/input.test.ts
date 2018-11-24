import { Input, writeInput } from "./input";

const map = {
  RegisterInput: {
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
  }
};

describe("Input", () => {
  const input = new Input();

  describe("write", () => {
    const written = input.write(map);
    // console.log("input: write", written);
    test("written", () => {
      expect(written).toMatch(/input RegisterInput {/);
      expect(written).toMatch(/name: String\!/);
      expect(written).toMatch(/@range\(min: 0, max: 130\)/);
      expect(written).toMatch(/age: Int\! @range\(min: 0, max: 130\)/);
      expect(written).toMatch(/age: Int/);
      expect(written).toMatch(/gender: Gender/);
    });
  });

  describe("writeInput", () => {
    const written = input.writeInput("RegisterInput", map.RegisterInput);
    // console.log("input:writeInput", written);
    test("written", () => {
      expect(written).toMatch(/input RegisterInput {/);
      expect(written).toMatch(/name: String\!/);
      expect(written).toMatch(/@range\(min: 0, max: 130\)/);
      expect(written).toMatch(/age: Int\! @range\(min: 0, max: 130\)/);
      expect(written).toMatch(/age: Int/);
      expect(written).toMatch(/gender: Gender/);
    });
  });
});
