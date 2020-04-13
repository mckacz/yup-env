import * as yup from 'yup'
import yupEnv from 'yup-env'

// define object schema that describes your app config
const schema = yup.object()
  .noUnknown()
  .shape({
    port: yup.number().default(3000),

    db: yup.object()
          .noUnknown()
          .required()
          .default(undefined)
          .shape({
            type: yup.string().required().oneOf(['mysql', 'postgresql']),
            host: yup.string().required(),
            port: yup.number().required().min(0).max(65535),
            user: yup.string().required(),
            pass: yup.string().required(),
          }),

    logging: yup.object()
               .noUnknown()
               .shape({
                 enabled: yup.boolean().default(true),
                 level:   yup.string().oneOf(['error', 'warning', 'info', 'trace']),
               }),
  })

export const config: Config = yupEnv({
  schema,
  prefix: 'APP__',
})

export type Config = yup.InferType<typeof schema>

// Config type is equivalent of:
//
// export interface Config {
//   port: number
//
//   db: {
//     type: string
//     host: string
//     port: number
//     user: string
//     pass: string
//   },
//
//   logging: {
//     enabled: boolean
//     level: string
//   }
// }
