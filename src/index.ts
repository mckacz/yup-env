import set from 'lodash.set'
import camelcase from 'camelcase'
import type { AnyObjectSchema, Asserts } from 'yup'

export type ValidateOptions = Parameters<AnyObjectSchema['validate']>[1]

export enum KeyNamingStrategy {
  camelCase = 'camelCase',
  snakeCase = 'snakeCase',
}

export interface Options<TSchema extends AnyObjectSchema> {
  schema: TSchema;
  env?: Record<string, string | undefined>;
  prefix?: string;
  levelSeparator?: string;
  validate?: ValidateOptions;
  keyNamingStrategy?: KeyNamingStrategy
}

function camelCaseKeyPath(parts: string[]): string[] {
  return parts.map(part => camelcase(part))
}

function snakeCaseKeyPath(parts: string[]): string[] {
  return parts.map(part => part.toLowerCase())
}

function yupEnv<TSchema extends AnyObjectSchema>(options: Options<TSchema>): Asserts<TSchema> {
  const { schema, env, prefix, levelSeparator, validate, keyNamingStrategy } = {
    env:               process.env,
    prefix:            '',
    levelSeparator:    '__',
    keyNamingStrategy: KeyNamingStrategy.camelCase,
    ...options,
  }

  const input: Record<string, unknown> = {}

  for (const key of Object.getOwnPropertyNames(env)) {
    if (!key.startsWith(prefix)) {
      continue
    }

    const propertyPathParts = key.substr(prefix.length)
      .split(levelSeparator)

    const propertyPath = keyNamingStrategy === KeyNamingStrategy.snakeCase
      ? snakeCaseKeyPath(propertyPathParts)
      : camelCaseKeyPath(propertyPathParts)

    set(input, propertyPath, env[key])
  }

  return schema.validateSync(input, validate)
}

export default yupEnv
