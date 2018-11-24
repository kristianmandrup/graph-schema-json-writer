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

export const writeAllInterfaces = (map, opts = {}) => {
  return createInterface(map, opts).write(map);
};

export const createInterface = (map, opts = {}) => {
  return new Interface(map, opts);
};

export class Interface extends Type {
  write(typeMap) {
    return super.write(typeMap, this.writeInterface);
  }

  writeInterface = (name, typeObj, opts = {}) =>
    this.writeType(name, typeObj, {
      entityName: "interface",
      ...opts
    });
}
