import { Base } from "./base";

export class BaseType extends Base {
  map: any;
  opts: any;

  constructor(map = {}, opts: any = {}) {
    super(opts, map);
    this.map = map;
  }

  flattenMap(map, separator: any = false) {
    const values = Array.isArray(map) ? map : (<any>Object).values(map);
    separator = separator === true ? "\n" : separator;
    return separator ? values.join(separator) : values.join(" ");
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

  indent(txt) {
    return "  " + txt;
  }
}
