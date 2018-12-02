import { createSoureFileWriter } from ".";
import * as fs from "fs-extra";
const mock = require("mock-fs");

mock({
  "usr/temp": {}
});

describe("createSoureFileWriter", () => {
  const opts = {
    baseDir: "usr/temp"
  };
  const writer = createSoureFileWriter(opts);
  const typeDefMap = {
    Person: {
      name: "Person",
      type: "Object",
      obj: {}
    }
  };

  describe("writeTypeDefs", async () => {
    const fileLocationMap = await writer.writeTypeDefs(typeDefMap);
    const personFilePath = fileLocationMap["Person"];
    const writtenSource = fs.readFile(personFilePath);
    test("writes source file to disk at target location", () => {
      expect(writtenSource).toMatch(/class Person {/);
    });
  });
});
