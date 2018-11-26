import { Base } from "./base";

export class Imports extends Base {
  importsLookupMap: any;
  decorators: string[];
  importsMap: any;

  constructor(decorators: string[], opts: any = {}) {
    super(decorators, opts);
    this.decorators = decorators;
    this.importsLookupMap = opts.importsMap;
    this.importsMap = this.resolveImportsMap();
  }

  resolveImportsMap() {
    return this.decorators.reduce((acc, name) => {
      const moduleName = this.importsLookupMap[name];
      if (!moduleName) {
        this.validateError(
          `missing imports entry for ${name}`,
          this.importsLookupMap
        );
      }
      acc[moduleName] = acc[moduleName] || [];
      acc[moduleName].push(name);
      return acc;
    }, {});
  }

  write() {
    return Object.keys(this.importsMap)
      .map(moduleName => {
        const imports = this.importsMap[moduleName];
        return this.writeImportsEntry(moduleName, imports);
      })
      .join("\n");
  }

  writeImportsEntry(moduleName, imports) {
    return `import { ${imports.join(", ")} } from '${moduleName}';/n`;
  }
}
