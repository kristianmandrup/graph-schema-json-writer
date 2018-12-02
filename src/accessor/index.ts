import { SchemaTypeMap } from "../types";

export const nonMetaKeys = jsonSchema => {
  const keys = Object.keys(jsonSchema);
  return keys.filter(key => /^__/.test(key));
};

export const filteredSchema = jsonSchema => {
  const keys = nonMetaKeys(jsonSchema);
  return keys.reduce((acc, key) => {
    acc[key] = jsonSchema[key];
    return acc;
  }, {});
};

const typeMap = {
  Object: "type",
  Enum: "enum",
  Interface: "interface",
  Input: "input"
};

export const schemaByType = (jsonSchema): SchemaTypeMap => {
  const schema: any = filteredSchema(jsonSchema);
  const schemaKeys = Object.keys(schema);
  const result: any = schemaKeys.reduce((acc, key) => {
    const value = jsonSchema[key];
    const { type } = value;
    const mappedType = typeMap[type] || type.toLowerCase() + "s";
    acc[mappedType] = acc[mappedType] || {};
    acc[mappedType][key] = value;
    return acc;
  }, {});
  return result;
};

export const enumRefsFor = (
  name: string,
  jsonSchema: any,
  ignoreTypes?: string[]
) => {
  return refsFor(name, jsonSchema, "Enum", ignoreTypes);
};

export const classRefsFor = (
  name: string,
  jsonSchema: any,
  ignoreTypes?: string[]
) => {
  return refsFor(name, jsonSchema, "Object", ignoreTypes);
};

const primitiveTypes = ["Int", "String", "Float", "Boolean"];

export const refsFor = (
  idOrObj: any,
  jsonSchema: any,
  refType = "Object",
  ignoreTypes: string[] = []
) => {
  const typesToIgnore = [...primitiveTypes, ...ignoreTypes, name];
  const obj = typeof idOrObj === "string" ? jsonSchema[idOrObj] : idOrObj;
  if (typeof obj === "object") {
    throw `invalid ${idOrObj} entry in json schema`;
  }

  const { fields } = obj;
  const fieldKeys = Object.keys(fields);
  fieldKeys.reduce((acc, key) => {
    const field = fields[key];
    const { type } = field;
    if (typesToIgnore.includes(type)) return acc;
    const schemaEntry = obj[type];
    const schemaEntryType = schemaEntry.type;
    if (schemaEntryType === refType) {
      acc[type] = schemaEntry;
    }
    return acc;
  }, {});
};
