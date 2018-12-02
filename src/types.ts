type Enable = {
  directives?: boolean;
  implements?: boolean;
};

export type WriteOpts = {
  enable?: any;
  entityName?: string;
  extendsClass?: string;
  importsMap?: any;
};

export type SchemaTypeMap = {
  types: any;
  enums: any;
  inputs: any;
  interfaces: any;
  unions: any;
};

export type TypeDefWriter = {
  writeSingle(name: string, obj: any, _: any): string;
  write(obj: any, write: Function);
};
