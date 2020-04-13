yup-env
=======

This is simple library to parse and validate environment variables using `yup` with full TypeScript support.

## Installation

You can get latest release with type definitions from NPM:

```
npm install yup yup-env --save
```

## Usage

Very basic usage:

```ts
// examples/simple.ts
import * as yup from 'yup'
import yupEnv from 'yup-env'

// define object schema that describes your app config
const schema = yup.object()
  .noUnknown()
  .shape({
    nodeEnv: yup.string().oneOf(['development', 'production']).default('production'),
    port:    yup.number().default(3000),
  })

// parse and validate environment variables
const config = yupEnv({ schema })

console.log(config)
// { port: 3000, nodeEnv: 'production' }

// if you specify following environment variables:
//   NODE_ENV=development
//   PORT=3001
// the output would be: { port: 3001, nodeEnv: 'development' }
```

More examples in [examples](./examples) directory.

## API

The library exposes single function as default export with following signature

```ts
function yupEnv<T extends object>(options: Options<T>): yup.InferType<yup.ObjectSchema<T>>; 
```

The function accepts following options:

Name             | Type                     | Description                                                    | Required           | Default value
-----------------|--------------------------|----------------------------------------------------------------|--------------------|---- 
`schema`         | `yup.ObjectSchema`       | Object schema used to cast and validate environment variables. | :heavy_check_mark: |
`env`            | `Record<string, string>` | Environment variables to process.                              |                    | value of `process.env`
`prefix`         | `string`                 | Prefix of environment variables names to process.              |                    | `''` (empty string)
`levelSeparator` | `string`                 | Nested structures path separator.                              |                    | `__` 
