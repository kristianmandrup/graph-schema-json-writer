import { addDirectives } from "./directive";
import { BaseType } from "./base";

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

export class Enum extends BaseType {
  constructor(map?, opts?) {
    super(map, opts);
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

  writeEnum(name, enumObj) {
    const header = `enum ${name}`;
    const fields = enumObj.fields || {};
    return `${header} {\n${this.writeFields(fields)}\n}\n`;
  }

  writeFields(fields) {
    return this.indent(fields.join("\n  "));
  }
}
