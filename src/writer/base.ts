export class Base {
  value: any;
  opts: any;

  constructor(opts: any = {}, value?: any) {
    this.opts = opts;
    this.value = value;
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
