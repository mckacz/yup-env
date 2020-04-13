import * as yup from 'yup'
import set from 'lodash.set'
import camelcase from 'camelcase'

export interface Options<T extends object> {
  schema: yup.ObjectSchema<T>;
  env?: Record<string, string | undefined>;
  prefix?: string;
  levelSeparator?: string;
}

function yupEnv<T extends object>(options: Options<T>): yup.InferType<yup.ObjectSchema<T>> {
  const { schema, env, prefix, levelSeparator } = {
    env:            process.env,
    prefix:         '',
    levelSeparator: '__',
    ...options,
  }

  const input: object = {}

  for (const key of Object.getOwnPropertyNames(env)) {
    if (!key.startsWith(prefix)) {
      continue
    }

    const propertyPath = key.substr(prefix.length)
      .split(levelSeparator)
      .map(part => camelcase(part))

    set(input, propertyPath, env[key])
  }

  return schema.validateSync(schema.cast(input)) as unknown as yup.InferType<yup.ObjectSchema<T>>
}

export default yupEnv
