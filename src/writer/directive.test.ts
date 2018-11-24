import { Directive, createDirective } from "./directive";

const map = {
  fields: {
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
    Entity: {},
    Validator: {
      type: "class-validator"
    }
  },
  type: "Object",
  implements: [],
  extends: "BaseEntity"
};

describe("Directive", () => {
  const directive = new Directive();

  describe("write: Entity directive", () => {
    const written = directive.write(map.directives);
    console.log("write", written);

    test("written", () => {
      expect(written).toBeDefined();
    });

    describe("writeDirective", () => {
      test("no args", () => {
        const written = directive.writeDirective("constraints", null);
        // console.log("writeDirective: 0", written);

        expect(written).toMatch(/@constraints\(\)/);
      });

      test("empty args", () => {
        const args = {};
        const written = directive.writeDirective("constraints", args);
        // console.log("writeDirective: 0", written);

        expect(written).toMatch(/@constraints\(\)/);
      });

      test("1 arg", () => {
        const args = { minLength: 1 };
        const written = directive.writeDirective("constraints", args);
        // console.log("writeDirective: 1", written);

        expect(written).toMatch(/@constraints/);
        expect(written).toMatch(/minLength: 1/);
      });

      test("2 args", () => {
        const args = { minLength: 1, contains: "axe" };
        const written = directive.writeDirective("constraints", args);
        // console.log("writeDirective: 2", written);

        expect(written).toMatch(/@constraints/);
        expect(written).toMatch(/contains: "axe"/);
        expect(written).toMatch(/minLength: 1/);
      });
    });
  });
});
