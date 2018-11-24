import { Directive } from "./directive";

export class BaseType {
  map: any;
  constructor(map = {}) {
    this.map = map;
  }

  flattenMap(map, newLine = false) {
    const values = (<any>Object).values(map);
    return newLine ? values.join("\n") : values;
  }

  validateObj(obj) {
    if (typeof obj === "object") return;
    this.validateError("object", obj);
  }

  validateError(type, obj) {
    const msg = `Validation error: ${type}`;
    console.error(msg, obj);
    throw new Error(msg);
  }
}
