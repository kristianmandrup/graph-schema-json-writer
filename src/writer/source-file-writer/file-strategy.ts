import * as fs from "fs-extra";
import * as path from "path";
import { dasherize } from "underscore.string";
import { Base } from "../base";

export class FileStrategy extends Base {
  baseDir: string;
  strategyName: string;
  stategyMap: any;
  writer: any;

  constructor(opts: any = {}) {
    super(opts);
    const { writer, baseDir, strategy, stategyMap } = opts;
    if (!baseDir) {
      this.error("missing baseDir option", opts);
    }
    this.writer = writer;
    this.baseDir = baseDir;
    this.strategyName = strategy || "default";
    this.stategyMap = stategyMap;
  }

  enumFilePathFor(name) {
    return this.filePathFor({ name, type: "Enum" });
  }

  fileMapFor(names: string[], type: string = "enum", withExt = false) {
    return names.reduce((acc, name) => {
      const filePathFn = this[`${type}FilePathFor`].bind(this);
      const filePath = filePathFn(name);
      acc[name] = withExt ? filePath : this.importRefName(filePath);
      return acc;
    }, {});
  }

  importRefName(filePath) {
    return path.join(path.dirname(filePath), path.basename(filePath, ".ts"));
  }

  enumFileMapFor(names: string[], withExt = true) {
    return this.fileMapFor(names, "enum", withExt);
  }

  classFileMapFor(names: string[], withExt = true) {
    return this.fileMapFor(names, "class", withExt);
  }

  enumImportsMap(names) {
    return this.enumFileMapFor(names, false);
  }

  classImportsMap(names) {
    return this.classFileMapFor(names, false);
  }

  classFilePathFor(name) {
    return this.filePathFor({ name, type: "Class" });
  }

  filePathFor(typeDef: any): string {
    const strategyMap = this.strategyMapFor(typeDef);
    const fileStrategy = strategyMap[this.strategyName];
    const { folderName, fileName } = fileStrategy(typeDef);
    this.writer.addToIndexMap({ folderName, fileName, name: typeDef.name });
    return fs.join(folderName || ".", fileName);
  }

  targetFilePath(fileName: string) {
    return fs.join(this.baseDir, fileName);
  }

  strategyMapFor(typeDef) {
    const { fileName, folderName } = this.fileAndFolderNameFor(typeDef);
    const map: any = {
      flat: (_: any) => ({ folderName: ".", fileName }),
      "type-folder": (_: any) => ({ folderName, fileName })
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
}
