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

let writer;

export const createSoureFileWriter = (opts: any = {}) => {
  return new SourceFileWriter(opts);
};

export const writeTypeDefs = async (typeDefMap: TypeDefMap, opts: any = {}) => {
  writer = createSoureFileWriter(opts);
  let result: any = {};
  result = await writer.writeTypeDefs(typeDefMap, opts);
  if (opts.index) {
    result.index = await writer.writeIndexFiles();
  }
  return result;
};

export const writeIndexFiles = async () => {
  if (!writer) {
    throw "Missing writer. You must call writeTypeDefs before writing index files for the files written";
  }
  return await writer.writeIndexFiles();
};

type TypeDefMap = {
  [key: string]: any;
};

export class SourceFileWriter extends Base {
  writers: any;
  strategy: FileStrategy;
  typeDefMap: any;
  indexMap: any;

  constructor(opts: any = {}) {
    super(opts);
    this.strategy = new FileStrategy({
      ...opts,
      writer: this
    });
  }

  addToIndexMap({ folderName, fileName, name }) {
    this.indexMap[folderName] = this.indexMap[folderName] || [];
    this.indexMap[folderName].push({ fileName, name });
  }

  async writeTypeDefs(typeDefMap: TypeDefMap, opts: any = {}) {
    this.typeDefMap = typeDefMap;
    const keys: string[] = Object.keys(typeDefMap);
    const { only } = opts;
    const keysToUse =
      Array.isArray(only) && only.length > 0
        ? keys.filter(key => only.includes(key))
        : keys;
    this.indexMap = {};
    const keyMap = keysToUse.reduce(async (acc, name: string) => {
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

    return { keyMap, indexMap: this.indexMap };
  }

  indexFileExports(indexMap?: any) {
    indexMap = indexMap || this.indexMap;
    return Object.keys(indexMap).reduce((acc, key) => {
      const { fileName, name } = indexMap[key];
      const exportStr = this.createIndexExport({ fileName, name });
      acc[key] = acc[key] || {};
      acc[key].push(exportStr);
      return acc;
    }, {});
  }

  indexFileContentMap(indexMap?: any) {
    indexMap = indexMap || this.indexMap;
    return Object.keys(indexMap).reduce((acc, key) => {
      acc[key] = acc[key].join("\n");
      return acc;
    }, {});
  }

  async writeIndexFiles(indexMap?: any) {
    indexMap = indexMap || this.indexMap;
    const { baseDir } = this.strategy;
    const contentMap = this.indexFileContentMap(indexMap);
    return Object.keys(contentMap).map(async key => {
      const filePath = path.join(baseDir, key, "index.ts");
      const fileContent = contentMap[key];
      await fs.writeFile(filePath, fileContent);
      return filePath;
    });
  }

  createIndexExport({ fileName, name }) {
    return `export { ${name} } from '${fileName}';\n`;
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
