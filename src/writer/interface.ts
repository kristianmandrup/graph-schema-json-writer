import { Type } from "./type";
import { writeType, writeTypes } from "./type";

export const writeInterfaces = typeMap => writeTypes(typeMap, writeInterface);

export const writeInterface = (name, typeObj, opts = {}) =>
  writeType(name, typeObj, {
    entityName: "interface",
    enable: {
      directives: false,
      implements: false
    },
    ...opts
  });

export const createInterface = (map, opts = {}) => {
  return new Interface(map);
};

export class Interface extends Type {
  write = typeMap => writeTypes(typeMap, this.writeInput);

  writeInput = (name, typeObj, opts = {}) =>
    this.writeType(name, typeObj, {
      entityName: "input",
      ...opts
    });
}
