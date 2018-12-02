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

  describe("lookupWriterFor", () => {
    test("lookup match", () => {
      const typeWriter = writer.writerFor("Object");
      expect(typeWriter).toBeTruthy();
    });
    test("no lookup match", () => {
      const typeWriter = writer.writerFor("unknown");
      expect(typeWriter).toBeFalsy();
    });
  });

  describe("writerFor", () => {
    const type = "Object";
    const typeDef = {
      type
    };

    test("lookup via type", () => {
      const typeWriter = writer.writerFor(type);
      expect(typeWriter).toBeTruthy();
    });

    test("lookup via typeDef", () => {
      const typeWriter = writer.writerFor(typeDef);
      expect(typeWriter).toBeTruthy();
    });

    test("creates type writer when no lookup match", () => {
      const typeDef = {
        type,
        name: "Person",
        obj: {}
      };

      // reset writers map
      writer.writers = {};
      const typeWriter = writer.writerFor(typeDef);
      expect(typeWriter).toBeTruthy();
    });
  });

  describe("imports", () => {
    writer.strategy.baseDir = "/src";
    writer.strategy.strategyName = "type-folder";

    describe("enumImportsMap", () => {
      const names = ["Gender"];
      const importsMap: any = writer.enumImportsMap(names);

      test("imports from expected file", () => {
        expect(importsMap.Gender).toEqual("/src/enum/Gender");
      });
    });

    describe("classImportsMap", () => {
      const names = ["Person"];
      const importsMap: any = writer.classImportsMap(names);

      test("imports from expected file", () => {
        expect(importsMap.Person).toEqual("/src/class/Person");
      });
    });

    describe("classRefImportsMap", () => {
      const enumRefs = ["Gender"];
      const classRefs = ["Person"];
      const importsMap: any = writer.classRefImportsMap({
        enumRefs,
        classRefs
      });

      test("imports from expected file", () => {
        expect(importsMap.Person).toEqual("/src/class/Person");
        expect(importsMap.Gender).toEqual("/src/enum/Gender");
      });
    });
  });

  describe("createWriterFor", () => {
    const obj = {
      fields: {
        name: {
          type: "String"
        }
      }
    };
    const typeDef = {
      type: "Object",
      name: "Person",
      obj
    };

    const typeWriter: any = writer.createWriterFor(typeDef);
    test("creates correct type writer", () => {
      expect(typeWriter.map).toBe(obj);
    });
  });

  describe("writeTypeDef", async () => {});

  describe("writeToFile", async () => {});
});
