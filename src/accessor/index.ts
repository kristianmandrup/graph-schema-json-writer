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
