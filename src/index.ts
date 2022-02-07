import * as yup from 'yup'
import set from 'lodash.set'
import camelcase from 'camelcase'
import type { ObjectShape as YupObjectShape } from 'yup/lib/object'
import type { ValidateOptions as YupValidateOptions } from 'yup/lib/types'

export type ObjectShape = YupObjectShape
export type ValidateOptions<TContext = {}> = YupValidateOptions<TContext>

export interface Options<TShape extends ObjectShape, TContext> {
  schema: yup.ObjectSchema<TShape>;
  env?: Record<string, string | undefined>;
  prefix?: string;
  levelSeparator?: string;
  validate?: ValidateOptions<TContext>;
}

function yupEnv<TShape extends ObjectShape, TContext>(options: Options<TShape, TContext>):
  yup.InferType<yup.ObjectSchema<TShape>> {

  const { schema, env, prefix, levelSeparator, validate } = {
    env:            process.env,
    prefix:         '',
    levelSeparator: '__',
    ...options,
  }

  const input: Record<string, unknown> = {}

  for (const key of Object.getOwnPropertyNames(env)) {
    if (!key.startsWith(prefix)) {
      continue
    }

    const propertyPath = key.substr(prefix.length)
      .split(levelSeparator)
      .map(part => camelcase(part))

    set(input, propertyPath, env[key])
  }

  return schema.validateSync(input, validate)
}

export default yupEnv
