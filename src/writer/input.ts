import { Type } from "./type";
import { writeTypes, writeType } from "./type";

export const writeInputs = typeMap => writeTypes(typeMap, writeInput);

export const writeInput = (name, typeObj, opts = {}) =>
  writeType(name, typeObj, {
    entityName: "input",
    ...opts
  });

export const writeAllInputs = (map, opts = {}) => {
  return createInput(map, opts).write(map);
};

export const createInput = (map, opts = {}) => {
  return new Input(map, opts);
};

export class Input extends Type {
  constructor(map?, opts = {}) {
    super(map, opts);
    this.asDecorator = false;
  }

  write(typeMap) {
    return super.write(typeMap, this.writeInput);
  }

  writeInput = (name, typeObj, opts = {}) =>
    this.writeType(name, typeObj, {
      entityName: "input",
      ...opts
    });
}
