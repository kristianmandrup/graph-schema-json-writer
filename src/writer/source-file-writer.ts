import * as fs from "fs-extra";
import * as path from "path";
import { Base } from "./base";
import { dasherize } from "underscore.string";
import { TypeDefWriter } from "../types";
import { createClass } from "./class";

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
  baseDir: string;
  writers: any;
  strategy: string;
  stategyMap: any;

  constructor(opts: any = {}) {
    super(opts);
    const { writers, baseDir, strategy, stategyMap } = opts;
    if (!baseDir) {
      this.error("missing baseDir option", opts);
    }
    this.strategy = strategy || "default";
    this.baseDir = baseDir;
    this.writers = writers;
    this.stategyMap = stategyMap;
  }

  async writeTypeDefs(typeDefMap: TypeDefMap, opts: any = {}) {
    const keys: string[] = Object.keys(typeDefMap);
    const { only } = opts;
    const keysToUse =
      Array.isArray(only) && only.length > 0
        ? keys.filter(key => only.includes(key))
        : keys;
    keysToUse.reduce(async (acc, key: string) => {
      const typeDef = typeDefMap[key];
      typeDef.name = key;
      typeDef.sourceType = this.mapToSourceType(typeDef.type);
      const typeDefWriter = this.writerFor(typeDef);
      const fileLocation = await this.writeTypeDef(
        typeDef,
        typeDefWriter,
        opts
      );
      acc[key] = fileLocation;
      return acc;
    }, {});
  }

  writerFor(typeDef: any) {
    return this.writers[typeDef.type] || this.createWriterFor(typeDef);
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
    const fileName = this.filePathFor(typeDef);
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

  filePathFor(typeDef: any): string {
    const strategyMap = this.strategyMapFor(typeDef);
    const fileStrategy = strategyMap[this.strategy];
    return fileStrategy(typeDef);
  }

  strategyMapFor(typeDef) {
    const { fileName, folderName } = this.fileAndFolderNameFor(typeDef);
    const map: any = {
      flat: (_: any) => fileName,
      "type-folder": (_: any) => fs.join(folderName, fileName)
    };
    map.default = map.flat;
    return this.stategyMap || map;
  }

  fileAndFolderNameFor(typeDef: any): any {
    return {
      fileName: this.fileNameFor(typeDef),
      folderName: this.folderNameFor(typeDef)
    };
  }

  folderNameFor(typeDef: any): string {
    const typeName = typeDef.sourceType || typeDef.type;
    return this.dasherize(typeName);
  }

  fileNameFor(typeDef: any): string {
    const name = typeDef.name;
    const fileName = this.dasherize(name);
    return `${fileName}.ts`;
  }

  dasherize(name: string): string {
    const dashed = dasherize(name);
    return dashed[0] === "_" ? dashed.substring(1) : dashed;
  }

  async writeToFile(fileName: string, fileContent: string) {
    const filePath = fs.join(this.baseDir, fileName);
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
