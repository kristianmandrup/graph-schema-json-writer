import { BaseType } from "./base";
import { addDirectives, createDirective } from "./directive";
import { addImplements } from "./implements";
import { WriteOpts } from "../types";
import { flattenMap } from "./util";

export const writeTypes = (typeMap, write = writeType) => {
  const typeKeys = Object.keys(typeMap);
  return typeKeys.reduce((acc, name) => {
    const typeObj = typeMap[name];
    acc[name] = write(name, typeObj);
    return acc;
  }, {});
};

export const writeType = (name, typeObj, opts: WriteOpts = {}) => {
  const { entityName = "type", enable = {} } = opts;
  let { directives, decorators, directiveKeys, keys } = typeObj;
  let header = `${entityName} ${name}`;
  const directivesMap = directives || decorators;
  directiveKeys = directiveKeys || keys;
  header =
    enable.directives || enable.decorators
      ? addDirectives(header, directivesMap, directiveKeys)
      : header;
  header = enable.implements
    ? addImplements(header, typeObj.implements)
    : header;
  const fields = typeObj.fields || {};
  return `${header} {\n${writeFields(fields)}\n}\n`;
};

const writeFields = fields => {
  const fieldKeys = Object.keys(fields);
  const fieldMap = fieldKeys.reduce((acc, name) => {
    const fieldObj = fieldMap[name];
    acc[name] = writeField(name, fieldObj);
    return acc;
  }, {});
  return flattenMap(fieldMap, true);
};

const writeField = (fieldName, fieldObj) => {
  let {
    type,
    isNullable,
    isList,
    directives,
    decorators,
    keys,
    directiveKeys
  } = fieldObj;
  let header = `${fieldName}: ${type}`;
  const decoratorMap = directives || decorators;
  directiveKeys = directiveKeys || keys;
  header = isNullable ? header : `${header}!`;
  header = isList ? `[${header}]` : header;
  return addDirectives(header, decoratorMap, directiveKeys);
};

export const createType = (map, opts = {}) => {
  return new Type(map);
};

export class Type extends BaseType {
  write = (typeMap, write = this.writeType) => {
    const typeKeys = Object.keys(typeMap);
    return typeKeys.reduce((acc, name) => {
      const typeObj = typeMap[name];
      acc[name] = write(name, typeObj);
      return acc;
    }, {});
  };

  writeType = (name, typeObj: any = {}, opts: WriteOpts = {}) => {
    const { entityName = "type", enable } = opts;
    const { directives } = typeObj;
    let header = `${entityName} ${name}`;
    header = enable.directives
      ? this.addDirectives(header, directives)
      : header;
    header = enable.implements
      ? this.addImplements(header, typeObj.implements)
      : header;
    const fields = typeObj.fields || {};
    return `${header} {\n${this.writeFields(fields)}\n}\n`;
  };

  addImplements = (txt, $implements) =>
    [txt, this.writeImplements($implements)].join(" ");

  writeImplements = $implements => $implements.join(", ");

  writeFields = fields => {
    const fieldKeys = Object.keys(fields);
    const fieldMap = fieldKeys.reduce((acc, name) => {
      const fieldObj = fieldMap[name];
      acc[name] = this.writeField(name, fieldObj);
      return acc;
    }, {});
    return flattenMap(fieldMap, true);
  };

  writeField = (fieldName, fieldObj) => {
    const { type, isNullable, isList, directives, directiveKeys } = fieldObj;
    let typeDef = isNullable ? type : `${type}!`;
    typeDef = isList ? `[${typeDef}]` : typeDef;
    let header = `${fieldName}: ${typeDef}`;
    return this.addDirectives(header, directives, directiveKeys);
  };

  addDirectives(header, directives, directiveKeys?) {
    const dirText = this.createDirective().write(directives);
    return directiveKeys.length > 0 ? [dirText, header].join("\n") : header;
  }

  createDirective(directives?) {
    return createDirective(directives);
  }
}
