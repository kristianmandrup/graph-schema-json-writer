import { flattenMap } from "./util";
import { BaseType } from "./base";

export const addDirectives = (txt, directives, directiveKeys?) => {
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

  constructor(map = {}, opts: any = {}) {
    super();
    const { keys = [], config, argsWrapped } = opts;
    this.directives = map;
    this.keys = keys || Object.keys(map);
    this.config = config;
    this.argsWrapped = argsWrapped;
  }

  write(directives?) {
    this.directives = directives || this.directives;
    const dirMap = this.keys.reduce(this.directiveReducer(), {});
    return dirMap;
  }

  directiveReducer() {
    return (acc, name) => {
      const args = this.directives[name];
      acc[name] = this.writeDirective(name, args);
      return acc;
    };
  }

  writeDirective(name, args, argsWrapped = false) {
    argsWrapped = argsWrapped || this.argsWrapped;
    let argsTxt = this.writeDirectiveArgs(args) as string;
    argsTxt = argsWrapped && argsTxt.length > 0 ? `{${argsTxt}}` : argsTxt;
    return `@${name}(${argsTxt})`;
  }

  writeDirectiveArgs = (args): string => {
    const dirMap = Object.keys(args).reduce(this.argReducer(args), {});
    return this.flattenMap(dirMap);
  };

  argReducer(args) {
    return (acc, name) => {
      const argValue = args[name];
      acc[name] = this.writeArg(name, argValue);
      return acc;
    };
  }

  writeArg(name, argValue) {
    return `${name}: ${argValue}`;
  }
}
