import { Enum, createEnum } from "./enum";

const map = {
  Gender: {
    fields: ["male", "female"],
    directives: {},
    type: "Enum"
  }
};

describe("Enum", () => {
  const $enum = new Enum();

  describe("write: Entity", () => {
    const written = $enum.write(map.Gender);

    test("written", () => {
      expect(written).toBeDefined();
    });
  });
});
