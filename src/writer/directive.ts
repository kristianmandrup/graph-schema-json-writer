import { flattenMap } from "./util";
import { BaseType } from "./base-type";

export const addDirectives = (txt, directives, directiveKeys?) => {
  if (!directives) return txt;
  const dirTxt = flattenMap(writeDirectives(directives, directiveKeys));
  console.log({ dirTxt });
  return [txt, dirTxt].join(" ");
};

export const writeDirectives = (directives, directiveKeys?) => {
  directiveKeys = directiveKeys || Object.keys(directives);
  return directiveKeys.reduce(directiveReducer(directives), {});
};

const directiveReducer = directives => {
  return (acc, name) => {
    const args = directives[name];
    acc[name] = writeDirective(name, args);
    return acc;
  };
};

const writeDirective = (name, args) => `@${name}(${writeDirectiveArgs(args)})`;

const writeDirectiveArgs = args =>
  flattenMap(Object.keys(args).reduce(argReducer(args), {}));

const argReducer = args => {
  return (acc, name) => {
    const argValue = args[name];
    acc[name] = writeArg(name, argValue);
    return acc;
  };
};

const writeArg = (name, argValue) => `${name}: ${argValue}`;

export const createDirective = (directives, opts = {}) => {
  return new Directive(directives, opts);
};

export class Directive extends BaseType {
  directives: any;
  keys: string[];
  config: any;
  argsWrapped: boolean = false;

  constructor(map?, opts: any = {}) {
    super();
    const { keys, config, argsWrapped } = opts;
    this.directives = map;
    this.keys = keys || (map && Object.keys(map));
    this.config = config;
    this.argsWrapped = argsWrapped;
  }

  write(directives?) {
    if (!directives) return "";
    this.directives = directives || this.directives;
    const keys = this.keys || Object.keys(directives);
    if (!keys || keys.length === 0) return "";
    const dirMap = keys.reduce(this.directiveReducer(), {});
    const dirTxt = this.flattenMap(dirMap);
    return dirTxt;
  }

  directiveReducer() {
    return (acc, name) => {
      const args = this.directives[name];
      acc[name] = this.writeDirective(name, args);
      return acc;
    };
  }

  writeDirective(name, args, opts: any = {}) {
    const { argsWrapped = false, emptyArgs = true } = opts;
    const dirTxt = `@${name}`;
    if (!args || args.length === 0) {
      return emptyArgs ? dirTxt + "()" : dirTxt;
    }
    const argsWrap = argsWrapped || this.argsWrapped;
    let argsTxt = this.writeDirectiveArgs(args);
    argsTxt =
      argsWrap && (argsTxt && argsTxt.length > 0) ? `{${argsTxt}}` : argsTxt;
    return `@${name}(${argsTxt})`;
  }

  writeDirectiveArgs = (args): string => {
    if (!args) return "";
    const keys = Object.keys(args);
    const dirMap = keys.reduce(this.argReducer(args), {});
    return this.flattenMap(dirMap, ", ");
  };

  argReducer(args) {
    return (acc, name) => {
      const argValue = args[name];
      acc[name] = this.writeArg(name, argValue);
      return acc;
    };
  }

  writeArg(name, argValue) {
    return `${name}: ${this.writeValue(argValue)}`;
  }

  writeValue(argValue) {
    return JSON.stringify(argValue);
  }
}
