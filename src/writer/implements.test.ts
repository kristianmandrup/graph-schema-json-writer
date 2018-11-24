import { addImplements } from "./implements";

const map = {
  type: "Object",
  implements: ["IEntity"],
  extends: "BaseEntity"
};

describe("addImplements", () => {
  const written = addImplements("", map.implements);

  test("written", () => {
    expect(written).toBeDefined();
  });
});
