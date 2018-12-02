export const typeorm = {
  BaseEntity: "typeorm",
  Entity: "typeorm"
};

const decorators = [
  "Length",
  "Contains",
  "IsEmpty",
  "IsNotEmpty",
  "IsArray",
  "IsNumber",
  "IsInt",
  "IsBoolean",
  "IsDate",
  "IsString",
  "IsPositive",
  "IsNegative",
  "IsMongoId",
  "IsISIN",
  "IsISBN",
  "IsEmail",
  "IsURL",
  "IsCreditCard",
  "IsIP",
  "IsUUID",
  "IsCurrency",
  "IsAlpha",
  "IsAlphanumeric",
  "Min",
  "Max",
  "MinDate",
  "MaxDate",
  "MinLength",
  "MaxLength"
  // ...
];

export const classValidator = decorators.reduce((acc, name) => {
  acc[name] = "class-validator";
  return acc;
}, {});

export const all = {
  ...classValidator,
  ...typeorm
};
