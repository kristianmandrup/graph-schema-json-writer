import { Enum, createEnum } from "./enum";

const map = {
  Gender: {
    fields: ["male", "female"],
    directives: {},
    type: "Enum"
  },
  Color: {
    fields: ["red", "green", "blue"],
    // directives: {},
    type: "Enum"
  }
};

describe("Enum", () => {
  const $enum = new Enum();

  describe("write: enums map", () => {
    const written = $enum.write(map);
    // console.log("enums", written);

    test("written", () => {
      expect(written).toMatch(/enum Gender {/);
      expect(written).toMatch(/  male/);
      expect(written).toMatch(/  female/);

      expect(written).toMatch(/enum Color {/);
      expect(written).toMatch(/  red/);
      expect(written).toMatch(/  blue/);
    });
  });

  describe("writeEnum: Gender", () => {
    const written = $enum.writeEnum("Gender", map.Gender);
    // console.log("enum", written);

    test("written", () => {
      expect(written).toMatch(/enum Gender {/);
      expect(written).toMatch(/  male/);
      expect(written).toMatch(/  female/);
    });
  });
});
