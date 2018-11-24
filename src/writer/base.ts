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
}
