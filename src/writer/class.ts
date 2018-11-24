import { classify } from "underscore.string";
import { BaseType } from "./base";
import { addDirectives, Directive } from "./directive";
import { addImplements } from "./implements";
import { flattenMap } from "./util";
import { WriteOpts } from "../types";

export const writeClasses = (classMap, write = writeClass) => {
  const classKeys = Object.keys(classMap);
  return classKeys.reduce((acc, name) => {
    const classObj = classMap[name];
    acc[name] = write(name, classObj);
    return acc;
  }, {});
};

const className = name => classify(name);

export const writeClass = (name, classObj, opts: WriteOpts = {}) => {
  let { extendsClass, entityName, enable } = opts;
  entityName = entityName || "class";
  enable = enable || {};

  const { directives, directiveKeys } = classObj;
  let header = `${className(entityName)} ${name}`;
  header = extendsClass
    ? [header, "extends", className(extendsClass)].join(" ")
    : header;
  header = enable.directives
    ? addDirectives(header, directives, directiveKeys)
    : header;
  header = enable.implements
    ? addImplements(header, classObj.implements, "implements")
    : header;
  const fields = classObj.fields || {};
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
  let { type, isNullable, isList, directives } = fieldObj;
  directives = directives || {};
  if (!isNullable) {
    directives.required = true;
  }
  const typeDef = isList ? `${type}[]` : type;
  let header = `${fieldName}: ${typeDef}`;
  return addDirectives(header, directives);
};

export const createClass = (map, opts = {}) => {
  return new ClassType(map);
};

export class ClassType extends BaseType {
  write(classMap, write = this.writeClass) {
    const classKeys = Object.keys(classMap);
    return classKeys.reduce((acc, name) => {
      const classObj = classMap[name];
      acc[name] = write(name, classObj);
      return acc;
    }, {});
  }

  writeClass = (name, classObj, opts: WriteOpts = {}) => {
    console.log("writeClass", { name, classObj, opts });
    this.validateObj(classObj);
    const { enable = {}, entityName, extendsClass } = opts;
    const { directives, decorators, directiveKeys } = classObj;
    let header = `${className(entityName)} ${name}`;
    header = extendsClass
      ? [header, "extends", className(extendsClass)].join(" ")
      : header;
    const directivesMap = directives || decorators;

    header =
      enable.directives || enable.decorators
        ? addDirectives(header, directivesMap, directiveKeys)
        : header;
    header = enable.implements
      ? this.addImplements(header, classObj.implements, "implements")
      : header;
    const fields = classObj.fields || {};
    return `${header} {\n${this.writeFields(fields)}\n}\n`;
  };

  addImplements(txt, $implements, keyWord?: string) {
    txt = keyWord ? [txt, keyWord].join(" ") : txt;
    return [txt, this.writeImplements($implements)].join(" ");
  }

  writeImplements($implements) {
    return $implements.join(", ");
  }

  writeFields(fields = {}) {
    const fieldKeys = Object.keys(fields);
    console.log("write fields", { fields, fieldKeys });
    const fieldMap = fieldKeys.reduce((acc, name) => {
      const fieldObj = fields[name] || {};
      console.log("write field", name);
      acc[name] = this.writeField(name, fieldObj);
      return acc;
    }, {});
    return flattenMap(fieldMap, true);
  }

  writeField(fieldName, fieldObj) {
    const {
      type = "String",
      isNullable,
      isList,
      directives,
      decorators,
      memberKeys,
      keys
    } = fieldObj;
    let header = `${fieldName}: ${type}`;
    const decoratorMap = decorators || directives;
    const decoratorKeys = memberKeys || keys || Object.keys(decoratorMap);
    header = isNullable ? header : `${header}!`;
    header = isList ? `[${header}]` : header;
    return this.addDecorators(header, decoratorMap, decoratorKeys);
  }

  addDecorators(header, decorators, decoratorKeys) {
    const dirWriter = this.createDecoratorWriter(decorators, {
      keys: decoratorKeys
    });
    const dirText = dirWriter.write();
    return decoratorKeys.length > 0 ? [dirText, header].join("\n") : header;
  }

  createDecoratorWriter(directives, opts) {
    return new Directive(directives, opts);
  }
}
