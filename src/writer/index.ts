import { writeTypes, Type } from "./type";
import { writeEnums, Enum } from "./enum";
import { schemaByType } from "../accessor";
import { writeInterfaces, Interface } from "./interface";
import { writeInputs, Input } from "./input";
import { writeClasses, writeClass, ClassType } from "./class";
import { flattenMap } from "./util";
import { SchemaTypeMap } from "../types";

export { Type, Enum, Interface, Input, ClassType, writeClasses, writeClass };

export const writeToTypeDef = (jsonSchema, flatten = false) => {
  const schemaTypeMap: SchemaTypeMap = schemaByType(jsonSchema);
  const { types, enums, inputs, interfaces } = schemaTypeMap;

  const writeMap = {
    types: writeTypes(types),
    enums: writeEnums(enums),
    interfaces: writeInterfaces(interfaces),
    inputs: writeInputs(inputs)
  };

  // for each value
  return flatten ? flattenMap(writeMap, true) : writeMap;
};
