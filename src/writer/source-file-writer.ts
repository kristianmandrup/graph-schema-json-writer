import * as fs from "fs-extra";
import * as path from "path";
import { Base } from "./base";
import { TypeDefWriter } from "../types";

export interface TypeDef {
  name: string;
  type: string;
  sourceType: string;
  obj: any;
}

export const createSoureFileWriter = (baseDir: string, opts: any = {}) => {
  return new SourceFileWriter(baseDir, opts);
};

type TypeDefMap = {
  [key: string]: any;
};

export class SourceFileWriter extends Base {
  baseDir: string;
  writers: any;

  constructor(baseDir: string, opts: any = {}) {
    super(opts);
    this.baseDir = baseDir;
    this.writers = opts.writers;
  }

  async writeTypeDefs(typeDefMap: TypeDefMap, opts: any = {}) {
    const keys: string[] = Object.keys(typeDefMap);
    keys.reduce(async (acc, key: string) => {
      const typeDef = typeDefMap[key];
      typeDef.name = key;
      typeDef.sourceType = this.mapToSourceType(typeDef.type);
      const fileLocation = await this.writeTypeDef(
        typeDef,
        this.writers[typeDef.type],
        opts
      );
      acc[key] = fileLocation;
      return acc;
    }, {});
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
    const fileName = this.fileNameFor(typeDef);
    const type = typeDef.sourceType || typeDef.type;
    return fs.join(type, fileName);
  }

  fileNameFor(typeDef: any): string {
    return `${typeDef.name}.ts`;
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
