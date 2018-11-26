export class Base {
  value: any;
  opts: any;

  constructor(value, opts: any = {}) {
    this.value = value;
    this.opts = opts;
  }

  validateObj(obj) {
    if (typeof obj === "object") return;
    this.validateError("object", obj);
  }

  validateError(type, obj) {
    const msg = `Validation error: ${type}`;
    this.error(msg, obj);
  }

  error(msg, obj) {
    console.error(msg, obj);
    throw new Error(msg);
  }

  indent(txt) {
    return "  " + txt;
  }
}
