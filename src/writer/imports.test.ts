import { Imports } from "./imports";

describe("Imports", () => {
  const importsMap = {
    Validate: "class-validator"
  };

  describe("missing importsMap", () => {
    test("throws", () => {
      expect(() => new Imports(["Validate"]).write()).toThrow();
    });
  });

  describe("missing importsMap", () => {
    const imports = new Imports(["Validate"], { importsMap }).write();

    test("imports", () => {
      expect(imports).toMatch(/import { Validate } from 'class-validator'/);
    });
  });
});
