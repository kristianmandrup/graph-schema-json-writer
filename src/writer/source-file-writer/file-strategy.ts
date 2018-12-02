import * as fs from "fs-extra";
import { dasherize } from "underscore.string";
import { Base } from "../base";

export class FileStrategy extends Base {
  baseDir: string;
  strategy: string;
  stategyMap: any;

  constructor(opts: any = {}) {
    super(opts);
    const { baseDir, strategy, stategyMap } = opts;
    if (!baseDir) {
      this.error("missing baseDir option", opts);
    }
    this.baseDir = baseDir;
    this.strategy = strategy || "default";
    this.stategyMap = stategyMap;
  }

  enumFilePathFor(name) {
    return this.filePathFor({ name, type: "Enum" });
  }

  classFilePathFor(name) {
    return this.filePathFor({ name, type: "Class" });
  }

  filePathFor(typeDef: any): string {
    const strategyMap = this.strategyMapFor(typeDef);
    const fileStrategy = strategyMap[this.strategy];
    return fileStrategy(typeDef);
  }

  targetFilePath(fileName: string) {
    return fs.join(this.baseDir, fileName);
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
}
