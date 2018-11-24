import { addDirectives } from "./directive";
import { BaseType } from "./base";

export const writeUnions = unionMap => {
  const unionKeys = Object.keys(unionMap);
  return unionKeys.reduce((acc, name) => {
    const unionObj = unionMap[name];
    acc[name] = writeUnion(name, unionObj);
    return acc;
  }, {});
};

const writeUnion = (name, unionObj) => {
  const { directives } = unionObj;
  const header = addDirectives(`union ${name}`, directives);
  const fields = unionObj.fields || {};
  return `${header} {\n${writeFields(fields)}\n}\n`;
};

const writeFields = fields => {};

export const createUnion = (map, opts = {}) => {
  return new Union(map);
};

export class Union extends BaseType {
  constructor(map?) {
    super(map);
  }

  write(unionMap?) {
    unionMap = unionMap || this.map;
    const unionKeys = Object.keys(unionMap);
    return unionKeys.reduce((acc, name) => {
      const unionObj = unionMap[name];
      acc[name] = this.writeUnion(name, unionObj);
      return acc;
    }, {});
  }

  writeUnion(name, unionObj: any = {}) {
    const header = `union ${name}`;
    return `${header} = ${this.writeTypes(unionObj.types || [])}\n`;
  }

  writeTypes(types) {
    return types.join(" | ");
  }
}
