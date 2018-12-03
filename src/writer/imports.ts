import { Base } from "./base";

export class Imports extends Base {
  importsLookupMap: any;
  decorators: string[];
  importsMap: any;

  constructor(decorators: string[], opts: any = {}) {
    super(decorators, opts);
    this.decorators = decorators;
    this.importsLookupMap = opts.importsMap;
    this.importsMap = this.resolveImportsMap(opts);
  }

  resolveImportsMap(opts) {
    return this.decorators.reduce((acc, name) => {
      const moduleName = this.importsLookupMap[name];
      if (!moduleName) {
        if (opts.validate) {
          this.validateError(
            `missing imports entry for ${name}`,
            this.importsLookupMap
          );
        }
        return acc;
      }
      acc[moduleName] = acc[moduleName] || [];
      acc[moduleName].push(name);
      return acc;
    }, {});
  }

  write() {
    return this.importFilesOf(this.importsMap)
      .map(moduleName => {
        const imports = this.importsMap[moduleName];
        return this.writeImportsEntry(moduleName, imports);
      })
      .join("\n");
  }

  importFilesOf(importsMap) {
    return Object.keys(importsMap).map((entry: any) => {
      return typeof entry === "string" ? entry : entry.importPath;
    });
  }

  writeImportsEntry(moduleName, imports) {
    const normalizedImports = this.extractImports(imports, moduleName);
    return `import { ${normalizedImports.join(", ")} } from '${moduleName}';/n`;
  }

  extractImports(imports, moduleName) {
    return imports.map(importObj =>
      typeof importObj === "string"
        ? importObj
        : this.aliasedImport(importObj, moduleName)
    );
  }

  aliasedImport(importObj, moduleName) {
    if (!importObj.name) {
      this.error(`importObj missing name`, importObj);
    }
    return `${importObj.name} as ${moduleName}`;
  }
}
