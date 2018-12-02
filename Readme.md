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

## Writing typescript source files

The writer also supports writing a TypeScript `class`, complete with:

- `extends` class
- implements `interfaces`
- decorators for class itself and fields and properties
  - imports for the decorators, interfaces and class extended

```js
import { schemaToJS } from "../src/schema";
import { writer, createClass } from "graph-schema-json-writer";
/// ... generate JSON schema
const jsSchema = schemaToJS(schema);
const classType = createClass(jsSchema);

const importsMap = {
  Range: "class-validator",
  BaseEntity: "typeorm",
  Entity: "typeorm"
};
const body = classType.writeClass("Person", jsSchema.Person, {
  importsMap
});
console.log(sourceFileTxt);
```

Output a TypeScript class with decorators

```ts
import { BaseEntity, Entity } from 'typeorm';
import { Range } from 'class-validator';

@Entity()
class Person extends BaseEntity {
  name: string

  @Range(min: 0, max: 130)
  age: number
}
```

## Writing source files

Use the `SourceFile` class to write source files to disk:

```ts
import { createSoureFileWriter, importsMap } from "graph-schema-json-writer";

// include typical import maps, such as for typeorm and class-validator
const myImportsMap = {
  ...importsMap.all
  // ...custom additions or overrides
};
const writeOpts = {
  importsMap: myImportsMap,
  srcFileDir: fs.join(__dirname, "db/model"),
  only: ["Person", "Gender"]
};

const srcFileWriter = createSoureFileWriter(writeOpts);
await srcFileWriter.writeTypeDefs(jsSchema, writeOpts);
```

Assuming `__dirname` is `/src`, using default `flat` strategy:

```txt
  /src
    /db
      /models
        Person.ts
        Gender.ts
```

Using defaults:

```ts
import { writeTypeDefs, importsMap } from "graph-schema-json-writer";
// ...
await writeTypeDefs(jsSchema, {
  importsMap: importsMap.all,
  srcFileDir: fs.join(__dirname, "db/model"),
  strategy: "type-folder"
  // only: ["Person", "Gender"]
});
```

Using `type-folder` strategy:

```txt
  /src
    /db
      /models
        /class
          Person.ts
        /enum/
          Gender.ts
```

### Roadmap

The infrastructure to write source files that are all correctly linked, using correct imports etc. is still incomplete.

You can use the new `FileStrategy` class to map `Enum` and `Class` references to file imports for a given class, such as through the `classWriter.strategy` of a given class writer to ensure the imports use the same strategy as is used to write the given class.

In `FileStrategy`, use the following to populate the `importsMap` of the class:

- `enumFilePathFor(name)`
- `classFilePathFor(name)`

For the `ClassType` class, see the following methods for reference:

- `classRefsFor`
- `enumsFor`
- `importsFor`

Please submit PRs to make it even easier to write a set of classes with all referenced classes, enums etc. as files, all linked with correct imports. Almost there!

You can try using the following API to generate an imports map for a given class such as `Person`

```ts
const names = classType.refNames("Person");
const classRefImportsMap = classWriter.classRefImportsMap(names);
```

## Use cases

This class writer could be used for writing classed for [TypeORM](http://typeorm.io/#/), [NestJS](https://nestjs.com/) or [TypeGraphQL](https://19majkel94.github.io/type-graphql/) etc.

Note that the class writer supports passing `decorators` in place of `directives`.

## License

MIT
