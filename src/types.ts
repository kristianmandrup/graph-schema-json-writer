type Enable = {
  directives?: boolean;
  implements?: boolean;
};

export type WriteOpts = {
  enable?: any;
  entityName?: string;
  extendsClass?: string;
};

export type SchemaTypeMap = {
  types: any;
  enums: any;
  inputs: any;
  interfaces: any;
  unions: any;
};
