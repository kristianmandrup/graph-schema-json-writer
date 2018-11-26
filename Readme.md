# GraphQL schema JSON Writer

Extension to [graphSchemaToJson](https://github.com/jjwtay/graphSchemaToJson) to write the schema generated from a GraphQL type def to various outputs:

- Typescript source files
- GraphQL type def files

Also includes accessor functionality to better work with the schema object generated.

## Usage

```js
{
  Person: {
    fields: {
      name: {
        type: 'String',
        directives: {},
        isNullable: false,
        isList: false
      },
      age: {
        type: 'Int',
        directives: {
          range: {
            min: 0,
            max: 130
          }
        },
        isNullable: false,
        isList: false
      },
      gender: {
        type: 'Gender',
        directives: {},
        isNullable: false,
        isList: false
      }
    },
    directives: {},
    type: 'Object',
    implements: []
  },
  Gender: {
    fields: ['male', 'female'],
    directives: {},
    type: 'Enum'
  }
}
```

## Accessor

```js
import { schemaToJS } from "../src/schema";
import { accessor } from "graph-schema-json-writer";
const { schemaByType, filteredSchema } = accessor;
/// ... generate JSON schema
const jsSchema = schemaToJS(schema);

// schema where all entries with keys starting with __ are filtered out
const filteredMap = filteredSchema(jsSchema);

// soreted by type
const typeMap = schemaByType(jsSchema);
console.log(typeMap);
```

```js
{
    Object: {
        Person: {
            // ....
        }
    },
    Enum: {
        Gender: {
            // ...
        }
    }
}
```

## Writer

```js
import { schemaToJS } from "../src/schema";
import { writer } from "graph-schema-json-writer";
const { writeToTypeDef } = writer;
/// ... generate JSON schema
const jsSchema = schemaToJS(schema);

// schema where all entries with keys starting with __ are filtered out
const typeDef = writeToTypeDef(jsSchema);
console.log(typeDef);
```

Should output the (original) GraphqL type def, nicely formatted:

```graphql
type Person {
  name: String!
  age: Int! @range(min: 0, max: 130)
  gender: Gender!
}

enum Gender {
  male
  female
}
```

Note: The writer now also supports writing a TypeScript `class`, complete with `extends` class, implements `interfaces`, decorators for class itself and fields and properties.

```js
import { schemaToJS } from "../src/schema";
import { writer } from "graph-schema-json-writer";
const { writeToTypeDef } = writer;
/// ... generate JSON schema
const jsSchema = schemaToJS(schema);

// schema where all entries with keys starting with __ are filtered out
const classType = createClassType(jsSchema);
const body = classType.writeClass("Person", jsSchema.Person);
const imports = classType.writeImportsFor("Person", {
  Range: "class-validator"
});

const sourceFileTxt = [imports, body].join("\n");

console.log(sourceFileTxt);
```

Output a TypeScript class with decorators

```ts
imports { range } from 'class-validator';

class Person {
  name: string

  @Range(min: 0, max: 130)
  age: number
}
```

## Use cases

This class writer could be used for writing classed for [TypeORM](http://typeorm.io/#/), [NestJS](https://nestjs.com/) or [TypeGraphQL](https://19majkel94.github.io/type-graphql/) etc.

Note that the class writer supports passing `decorators` in place of `directives`.

## License

MIT
