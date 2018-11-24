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
    const written = directive.write(map.directives.Entity);
    console.log(written);

    test("written", () => {
      expect(written).toBeDefined();
    });
  });
});
