import { addDirectives } from "./directive";
import { BaseType } from "./base-type";
import { TypeDefWriter } from "../types";

export const writeEnums = enumMap => {
  const enumKeys = Object.keys(enumMap);
  return enumKeys.reduce((acc, name) => {
    const enumObj = enumMap[name];
    acc[name] = writeEnum(name, enumObj);
    return acc;
  }, {});
};

const writeEnum = (name, enumObj) => {
  const { directives } = enumObj;
  const header = addDirectives(`enum ${name}`, directives);
  const fields = enumObj.fields || {};
  return `${header} {\n${writeFields(fields)}\n}\n`;
};

const writeFields = fields => {};

export const writeAllEnums = (map, opts = {}) => {
  return createEnum(map, opts).write(map);
};

export const createEnum = (map, opts = {}) => {
  return new Enum(map, opts);
};

export class Enum extends BaseType implements TypeDefWriter {
  protected _fieldSeparator: any;

  constructor(map?, opts: any = {}) {
    super(map, opts);
    this._fieldSeparator = opts.typescript
      ? opts.typeScriptFieldSeparator
      : opts.fieldSeparator;
  }

  write(enumMap?) {
    enumMap = enumMap || this.map;
    const enumKeys = Object.keys(enumMap);
    const enums = enumKeys.reduce((acc, name) => {
      const enumObj = enumMap[name];
      acc[name] = this.writeEnum(name, enumObj);
      return acc;
    }, {});
    return this.flattenMap(enums, true);
  }

  writeSingle(name: string, enumObj: any, _: any): string {
    return this.writeEnum(name, enumObj);
  }

  writeEnum(name, enumObj) {
    const header = `enum ${name}`;
    const fields = enumObj.fields || {};
    return `${header} {\n${this.writeFields(fields)}\n}\n`;
  }

  writeFields(fields) {
    return this.indent(fields.join(this.fieldSeparator));
  }

  get defaultFieldSeparator() {
    return "\n  ";
  }

  get typeScriptFieldSeparator() {
    return "," + this.defaultFieldSeparator;
  }

  get fieldSeparator() {
    return this._fieldSeparator || this.defaultFieldSeparator;
  }
}
