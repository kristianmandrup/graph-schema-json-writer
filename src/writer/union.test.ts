import { Union, createUnion } from "./union";

const map = {
  Auto: {
    types: ["Car", "Vehicle"],
    type: "Union"
  }
};

describe("Union", () => {
  const union = new Union();

  describe("write", () => {
    const written = union.write(map);

    test("written", () => {
      expect(written).toMatch(/union Auto = Car \| Vehicle/);
    });
  });

  describe("writeUnion", () => {
    const written = union.writeUnion("Auto", map.Auto);

    test("written", () => {
      expect(written).toMatch(/union Auto = Car \| Vehicle/);
    });
  });
});
