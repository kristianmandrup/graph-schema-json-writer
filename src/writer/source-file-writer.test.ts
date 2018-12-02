import * as fs from "fs-extra";
import { createSoureFileWriter } from "./source-file-writer";
import * as mock from "mock-fs";

mock({
  "usr/temp": {}
});

describe("createSoureFileWriter", () => {
  const opts = {};
  const writer = createSoureFileWriter("usr/temp", opts);
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
