import { Type } from "./type";
import { writeTypes, writeType } from "./type";

export const writeInputs = typeMap => writeTypes(typeMap, writeInput);

export const writeInput = (name, typeObj, opts = {}) =>
  writeType(name, typeObj, {
    entityName: "input",
    ...opts
  });

export const createInput = (map, opts = {}) => {
  return new Input(map);
};

export class Input extends Type {
  write = typeMap => writeTypes(typeMap, this.writeInput);

  writeInput = (name, typeObj, opts = {}) =>
    this.writeType(name, typeObj, {
      entityName: "input",
      ...opts
    });
}
