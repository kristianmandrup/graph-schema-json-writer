import { classify } from "underscore.string";
import { BaseType } from "./base-type";
import { addDirectives, createDirective } from "./directive";
import { addImplements } from "./implements";
import { flattenMap } from "./util";
import { WriteOpts } from "../types";
import { Imports } from "./imports";
import { classRefsFor, enumRefsFor } from "../accessor";

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
  header =
    enable.directives && directives
      ? addDirectives(header, directives, directiveKeys)
      : header;
  header =
    enable.implements && classObj.implements
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

export const writeAllClasses = (map, opts = {}) => {
  return createClass(map, opts).write(map);
};

export const createClass = (map, opts = {}) => {
  return new ClassType(map);
};

export class ClassType extends BaseType {
  addRequired: boolean;

  constructor(map?, opts: any = {}) {
    super(map, opts);
    this.addRequired = opts.addRequired;
  }

  classMapFor(classMapOrId: any) {
    return typeof classMapOrId === "string"
      ? this.map[classMapOrId]
      : classMapOrId;
  }

  classDecoratorsFor(classMapOrId: any) {
    const classMap = this.classMapFor(classMapOrId) || {};
    return classMap.decorators || classMap.directives;
  }

  interfacesFor(classMapOrId: any) {
    const classMap = this.classMapFor(classMapOrId) || {};
    return classMap.implements || classMap.interfaces;
  }

  fieldDecoratorsFor(classMapOrId: any) {
    const classMap = this.classMapFor(classMapOrId);
    return Object.values(classMap.fields)
      .map((field: any) => field.decorators || field.directives)
      .flatMap(item => item);
  }

  classRefsFor(idOrObj: any): any {
    return classRefsFor(idOrObj, this.map);
  }

  enumRefsFor(idOrObj: any): any {
    return enumRefsFor(idOrObj, this.map);
  }

  enumRefNames(idOrObj: string): string[] {
    return Object.keys(this.enumRefsFor(idOrObj));
  }

  classRefNames(idOrObj: string): string[] {
    return Object.keys(this.classRefsFor(idOrObj));
  }

  refNames(idOrObj: string): any {
    return {
      classRefs: this.classRefNames(idOrObj),
      enumRefs: this.enumRefNames(idOrObj)
    };
  }

  decoratorsFor(classMapOrId: any) {
    return [
      ...this.classDecoratorsFor(classMapOrId),
      ...this.fieldDecoratorsFor(classMapOrId)
    ];
  }

  importsFor(classMapOrId: any, opts: any = {}) {
    const decorators = this.decoratorsFor(classMapOrId) || [];
    const { extendsClass } = opts;
    const interfaces = this.interfacesFor(classMapOrId) || [];

    const enumRefNames: string[] = this.enumRefNames(classMapOrId) || [];
    const classRefNames: string[] = this.classRefNames(classMapOrId) || [];

    const allImportConsts = [
      extendsClass,
      ...decorators,
      ...interfaces,
      ...enumRefNames,
      ...classRefNames
    ];
    return new Imports(allImportConsts, opts || this.opts);
  }

  extendsClassImportFor(className, opts = {}) {
    return new Imports([className], opts || this.opts);
  }

  writeImportsFor(classMapOrId: any, opts = {}) {
    return this.importsFor(classMapOrId, opts).write();
  }

  write(classMap, write = this.writeClass) {
    const classKeys = Object.keys(classMap);
    return classKeys.reduce((acc, name) => {
      const classObj = classMap[name];
      acc[name] = write(name, classObj);
      return acc;
    }, {});
  }

  writeSingle(name, classObj, opts: any) {
    this.writeClass(name, classObj, opts);
  }

  writeClass = (name, classObj, opts: WriteOpts = {}) => {
    this.validateObj(classObj);
    const { enable = {}, entityName = "class", extendsClass } = opts;
    const { directives, decorators, directiveKeys } = classObj;
    let header = `${entityName} ${className(name)}`;
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

    const classBody = `${header} {\n${this.writeFields(fields)}\n}\n`;

    if (opts.importsMap) {
      const importsHeader = this.writeImportsFor(name, opts);
      return [importsHeader, classBody].join("\n\n");
    }

    return classBody;
  };

  addImplements(txt, $implements = [], extendKeyword = "implements") {
    if (!$implements || $implements.length === 0) return "";
    const header = extendKeyword ? [txt, extendKeyword].join(" ") : txt;
    return [header, this.writeImplements($implements)].join(" ");
  }
  writeImplements($implements) {
    return $implements.join(", ");
  }

  writeFields(fields = {}) {
    const fieldKeys = Object.keys(fields);
    const fieldMap = fieldKeys.reduce((acc, name) => {
      const fieldObj = fields[name] || {};
      acc[name] = this.writeField(name, fieldObj);
      return acc;
    }, {});
    return this.flattenMap(fieldMap, "\n\n");
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

    const decoratorKeys = memberKeys || keys;
    const decoratorMap = decorators || directives;

    if (!isNullable && this.addRequired) {
      decoratorMap.Required = {};
      if (decoratorKeys) {
        decoratorKeys.push("Nullable");
      }
    }
    const resolvedKeys = decoratorKeys || Object.keys(decoratorMap);
    header = isList ? `[${header}]` : header;
    header = this.indent(header);
    const withDecorators =
      resolvedKeys.length > 0
        ? this.addDecorators(header, decoratorMap, resolvedKeys)
        : header;
    return withDecorators;
  }

  addDecorators(header, decorators, decoratorKeys) {
    const dirWriter = this.createDecoratorWriter(decorators, {
      keys: decoratorKeys
    });
    const dirResult = dirWriter.write();
    const dirText =
      typeof dirResult === "string"
        ? dirResult
        : this.flattenMap(dirResult, "\n  ");
    const decoratorsTxt =
      decoratorKeys.length > 0 || dirText.length > 0
        ? [dirText, header].join("\n")
        : header;
    return this.indent(decoratorsTxt);
  }

  createDecoratorWriter(directives, opts) {
    return createDirective(directives, { ...opts, argsWrapped: true });
  }
}
