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
