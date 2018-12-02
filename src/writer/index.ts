import { writeAllTypes, Type } from "./type";
import { writeAllEnums, Enum } from "./enum";
import { schemaByType } from "../accessor";
import { writeAllInterfaces, Interface } from "./interface";
import { writeAllInputs, Input } from "./input";
import { writeAllClasses, ClassType } from "./class";
import { writeAllUnions, Union } from "./union";
import { Imports } from "./imports";
import { flattenMap } from "./util";
import { SchemaTypeMap } from "../types";
import { SourceFileWriter, createSoureFileWriter } from "./source-file-writer";
import * as importsMap from "./imports-map";

export {
  Imports,
  Type,
  Enum,
  Interface,
  Input,
  Union,
  ClassType,
  SourceFileWriter,
  createSoureFileWriter,
  writeAllClasses,
  importsMap
};

export const writeToTypeDef = (jsonSchema, opts: any = {}) => {
  const { flatten } = opts;
  const schemaTypeMap: SchemaTypeMap = schemaByType(jsonSchema);
  const { types, enums, inputs, interfaces, unions } = schemaTypeMap;

  const writeMap = {
    types: writeAllTypes(types, opts),
    enums: writeAllEnums(enums, opts),
    interfaces: writeAllInterfaces(interfaces, opts),
    inputs: writeAllInputs(inputs, opts),
    unions: writeAllUnions(unions, opts)
  };

  // for each value
  return flatten ? flattenMap(writeMap, flatten) : writeMap;
};
