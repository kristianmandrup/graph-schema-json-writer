import * as path from "path";
import * as fs from "fs-extra";
import { Base } from "../base";
import { TypeDefWriter } from "../../types";
import { createClass } from "../class";
import { FileStrategy } from "./file-strategy";

export { FileStrategy };

export interface TypeDef {
  name: string;
  type: string;
  sourceType: string;
  obj: any;
}

export const createSoureFileWriter = (opts: any = {}) => {
  return new SourceFileWriter(opts);
};

export const writeTypeDefs = (typeDefMap: TypeDefMap, opts: any = {}) => {
  const writer = createSoureFileWriter(opts);
  return writer.writeTypeDefs(typeDefMap, opts);
};

type TypeDefMap = {
  [key: string]: any;
};

export class SourceFileWriter extends Base {
  writers: any;
  strategy: FileStrategy;
  typeDefMap: any;

  constructor(opts: any = {}) {
    super(opts);
    this.strategy = new FileStrategy(opts);
  }

  async writeTypeDefs(typeDefMap: TypeDefMap, opts: any = {}) {
    this.typeDefMap = typeDefMap;
    const keys: string[] = Object.keys(typeDefMap);
    const { only } = opts;
    const keysToUse =
      Array.isArray(only) && only.length > 0
        ? keys.filter(key => only.includes(key))
        : keys;
    keysToUse.reduce(async (acc, name: string) => {
      const typeDef = typeDefMap[name];
      typeDef.name = name;
      typeDef.sourceType = this.mapToSourceType(typeDef.type);
      const typeDefWriter = this.writerFor(typeDef);

      const { enumRefs, classRefs } = typeDef.refNames(name);
      const importsMap = this.classRefImportsMap({ enumRefs, classRefs });
      const relativeImportsMap = this.relativeImportsMap(typeDef, importsMap);
      opts.importsMap = {
        ...relativeImportsMap,
        ...(opts.importsMap || {})
      };

      const fileLocation = await this.writeTypeDef(
        typeDef,
        typeDefWriter,
        opts
      );
      acc[name] = fileLocation;
      return acc;
    }, {});
  }

  writerFor(typeDef: any) {
    const type = typeof typeDef === "string" ? typeDef : typeDef.type;
    return this.lookupWriterFor(type) || this.createWriterFor(typeDef);
  }

  lookupWriterFor(type: string) {
    return this.writers[type];
  }

  enumImportsMap(names: string[]) {
    return this.strategy.enumImportsMap(names);
  }

  classImportsMap(names: string[]) {
    return this.strategy.classImportsMap(names);
  }

  classRefImportsMap(map: any) {
    return {
      ...this.classImportsMap(map.enumRefs),
      ...this.enumImportsMap(map.classRefs)
    };
  }

  relativeImportsMap(typeDef: any, map: any) {
    const fromPath = this.strategy.filePathFor(typeDef);
    return Object.keys(map).reduce((acc, key) => {
      const toPath = map[key];
      acc[key] = path.relative(fromPath, toPath);
      return acc;
    }, {});
  }

  get writerMap() {
    return {
      Object: createClass
    };
  }

  createWriterFor(typeDef: any) {
    const writerFactory = this.writerMap[typeDef.type];
    const map = {
      [typeDef.name]: typeDef.obj
    };
    return writerFactory(map, this.opts);
  }

  get sourceTypeMap() {
    return {
      Object: "Class"
    };
  }

  mapToSourceType(type: string) {
    return this.sourceTypeMap[type] || type;
  }

  async writeTypeDef(typeDef: TypeDef, writer: TypeDefWriter, opts: any = {}) {
    const fileName = this.strategy.filePathFor(typeDef);
    const writeOpts = {
      ...this.opts,
      ...opts
    };
    const fileContent = writer.writeSingle(
      typeDef.name,
      typeDef.obj,
      writeOpts
    );
    await this.writeToFile(fileName, fileContent);
  }

  async writeToFile(fileName: string, fileContent: string) {
    const filePath = this.strategy.targetFilePath(fileName);
    try {
      const targetDir = path.dirname(filePath);
      await fs.ensureDir(targetDir);
      await fs.writeFile(filePath, fileContent);
      return filePath;
    } catch (err) {
      this.error(err.message, err);
    }
  }
}
