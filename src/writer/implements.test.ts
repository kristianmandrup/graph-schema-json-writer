import { addImplements } from "./implements";

const map = {
  empty: {
    type: "Object",
    implements: []
  },
  one: {
    type: "Object",
    implements: ["IEntity"],
    extends: "BaseEntity"
  },
  two: {
    type: "Object",
    implements: ["Abc", "Xyz"]
  }
};

describe("addImplements", () => {
  test("no interface", () => {
    const written = addImplements("", null);
    // console.log("implements: none", written);

    expect(written).toEqual("");
  });
  test("empty interface", () => {
    const written = addImplements("", map.empty.implements);
    // console.log("implements: empty", written);
    expect(written).toEqual("");
  });
  test("1 interface", () => {
    const written = addImplements("", map.one.implements);
    // console.log("implements: 1", written);

    expect(written).toMatch(/implements IEntity/);
  });

  test("1 interface", () => {
    const written = addImplements("", map.two.implements);
    // console.log("implements: 2", written);

    expect(written).toMatch(/implements Abc, Xyz/);
  });
});
