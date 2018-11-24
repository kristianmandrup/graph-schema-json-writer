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
  const { entityName = "type", enable = { directives: true } } = opts;
  let { directives, decorators, directiveKeys, keys } = typeObj;
  let header = `${entityName} ${name}`;
  const directivesMap = directives || decorators;
  directiveKeys = directiveKeys || keys;
  header =
    enable.directives || enable.decorators
      ? addDirectives(header, directivesMap, directiveKeys)
      : header;
  console.log("!writeType", header);
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
  asDecorator: boolean;
  enable: any;

  constructor(map?, opts: any = {}) {
    super(map, opts);
    this.asDecorator = opts.asDecorator;
    this.enable = opts.enable || { directives: true, implements: true };
  }

  public write(typeMap, writeType = this.writeType) {
    const typeKeys = Object.keys(typeMap);
    const typesTxtMap = typeKeys.reduce((acc, name) => {
      const typeObj = typeMap[name];
      acc[name] = writeType(name, typeObj);
      return acc;
    }, {});
    return this.flattenMap(typesTxtMap, true);
  }

  writeType = (name, typeObj: any = {}, opts: WriteOpts = {}) => {
    let { entityName = "type", enable } = opts;
    enable = enable || this.enable;
    const { directives } = typeObj;
    let header = `${entityName} ${name}`;
    header =
      enable.directives && directives
        ? this.addDirectives(header, directives, null, { asDecorator: true })
        : header;
    header =
      enable.implements && typeObj.implements
        ? this.addImplements(header, typeObj.implements)
        : header;
    const fields = typeObj.fields || {};
    return `${header} {\n${this.writeFields(fields)}\n}\n`;
  };

  addImplements = (txt, $implements) => {
    if (!$implements || $implements.length === 0) return txt;
    return [txt, this.writeImplements($implements)].join(" ");
  };

  writeImplements = $implements => {
    if (!$implements) return "";
    return $implements.join(", ");
  };

  writeFields = (fields = {}) => {
    if (!fields) return "";
    const fieldKeys = Object.keys(fields);
    const fieldMap = fieldKeys.reduce((acc, name) => {
      const fieldObj = fields[name];
      acc[name] = this.writeField(name, fieldObj);
      return acc;
    }, {});
    return this.indent(this.flattenMap(fieldMap, "\n  "));
  };

  writeField = (fieldName, fieldObj) => {
    const { type, isNullable, isList, directives, directiveKeys } = fieldObj;
    let typeDef = isNullable ? type : `${type}!`;
    typeDef = isList ? `[${typeDef}]` : typeDef;
    let header = `${fieldName}: ${typeDef}`;
    const fieldTxt = directives
      ? this.addDirectives(header, directives, directiveKeys)
      : header;
    return fieldTxt;
  };

  addDirectives(header, directives, directiveKeys?, opts: any = {}) {
    if (!directives) return header;
    const dirText = this.createDirective().write(directives) + "";
    const asDecorator = opts.asDecorator || this.asDecorator;
    return asDecorator
      ? [dirText, header].join("\n")
      : [header, dirText].join(" ");
  }

  createDirective(directives?) {
    return createDirective(directives);
  }
}
